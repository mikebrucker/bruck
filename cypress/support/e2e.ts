import type { AlbumCreateInput } from "@/data/albumSchema";
import type { ArtistCreateInput } from "@/data/artistSchema";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";

const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;
type HttpMethod = keyof typeof HttpMethods;

type ApiOptions = {
  body?: Cypress.RequestBody;
  /** Sent verbatim as application/json, for malformed-body cases */
  rawBody?: string;
  /** true sends the admin bearer token, a string is sent as the raw Authorization header */
  auth?: boolean | string;
};

declare global {
  namespace Cypress {
    interface ApiError {
      error: string;
    }

    interface Chainable {
      /** Request against /api{path}/ without failing on non-2xx, so specs can assert any status */
      api<T = unknown>(
        method: HttpMethod,
        path: string,
        options?: ApiOptions,
      ): Chainable<Response<T>>;
      /** Asserts 401 for a missing header, a wrong token and a non-Bearer scheme */
      expectUnauthorized(method: HttpMethod, path: string): Chainable<void>;
      /** Asserts 400 for a body that is not valid JSON */
      expectInvalidJson(method: HttpMethod, path: string): Chainable<void>;
      createArtist(overrides?: Partial<ArtistCreateInput>): Chainable<Artist>;
      createAlbum(artistId: string, overrides?: Partial<AlbumCreateInput>): Chainable<Album>;
      /** Deletes every fixture artist and its albums, which cascades to user_albums */
      purgeFixtures(): Chainable<void>;
    }
  }
}

/** Fixture artist names slug to ids under a shared prefix so purges never touch real artists */
class Fixtures {
  static readonly idPrefix = "e2e_fixture_";
  private static readonly runId = Date.now().toString(36);
  private static count = 0;

  static artistName(): string {
    Fixtures.count += 1;
    return `E2E Fixture ${Fixtures.runId} ${Fixtures.count}`;
  }

  static albumName(): string {
    Fixtures.count += 1;
    return `E2E Album ${Fixtures.count}`;
  }
}

Cypress.Commands.add("api", (method, path, { body, rawBody, auth } = {}) =>
  cy.env<{ ADMIN_TOKEN: string }>(["ADMIN_TOKEN"], { log: false }).then(({ ADMIN_TOKEN }) => {
    const headers: Record<string, string> = {};
    if (auth === true) {
      headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
    } else if (typeof auth === "string") {
      headers.Authorization = auth;
    }
    if (rawBody !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    return cy.request({
      method,
      // trailingSlash: true in next.config 308s slashless paths, so hit the canonical URL
      url: `/api${path}/`,
      headers,
      body: rawBody ?? body,
      failOnStatusCode: false,
    });
  }),
);

Cypress.Commands.add("expectUnauthorized", (method, path) => {
  const headers: Array<string | undefined> = [undefined, "Bearer wrong-token", "Basic abc123"];
  for (const auth of headers) {
    cy.api<Cypress.ApiError>(method, path, { auth, body: {} }).then(({ status, body }) => {
      expect(status).to.eq(401);
      expect(body.error).to.eq("Unauthorized");
    });
  }
});

Cypress.Commands.add("expectInvalidJson", (method, path) => {
  cy.api<Cypress.ApiError>(method, path, { auth: true, rawBody: "{not json" }).then(
    ({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.error).to.eq("Invalid JSON body");
    },
  );
});

Cypress.Commands.add("createArtist", (overrides = {}) =>
  cy
    .api<Artist>("POST", "/artists", {
      auth: true,
      body: { artist: Fixtures.artistName(), ...overrides },
    })
    .then(({ status, body }) => {
      expect(status).to.eq(201);
      return body;
    }),
);

Cypress.Commands.add("createAlbum", (artistId, overrides = {}) =>
  cy
    .api<Album>("POST", "/albums", {
      auth: true,
      body: {
        artistId,
        album: Fixtures.albumName(),
        year: 2001,
        label: ["Self-released"],
        genre: ["Progressive Metal"],
        runtime: "9:00",
        tracks: [
          { number: 1, title: "Opener", duration: "4:00" },
          { number: 2, title: "Closer", duration: "5:00" },
        ],
        ...overrides,
      },
    })
    .then(({ status, body }) => {
      expect(status).to.eq(201);
      return body;
    }),
);

Cypress.Commands.add("purgeFixtures", () => {
  cy.api<Array<Artist>>("GET", "/artists").then(({ body: artists }) => {
    const artistIds = new Set(
      artists.map((artist) => artist.id).filter((id) => id.startsWith(Fixtures.idPrefix)),
    );
    cy.api<Array<Album>>("GET", "/albums").then(({ body: albums }) => {
      for (const album of albums.filter((album) => artistIds.has(album.artistId))) {
        cy.api("DELETE", `/albums/${album.id}`, { auth: true }).its("status").should("eq", 204);
      }
      for (const id of artistIds) {
        cy.api("DELETE", `/artists/${id}`, { auth: true }).its("status").should("eq", 204);
      }
    });
  });
});
