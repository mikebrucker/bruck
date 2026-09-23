import type { AlbumCreateInput } from "@/data/albumSchema";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";

describe("/api/albums", () => {
  const missingArtistId = "e2e_fixture_missing";
  let artist: Artist;
  let album: Album;
  let sibling: Album;

  const albumInput = (overrides: Partial<AlbumCreateInput> = {}): AlbumCreateInput => ({
    artistId: artist.id,
    album: "Input Album",
    year: 2001,
    label: ["Self-released"],
    genre: ["Progressive Metal"],
    runtime: "9:00",
    tracks: [{ number: 1, title: "Only", duration: "9:00" }],
    ...overrides,
  });

  before(() => {
    cy.purgeFixtures();
    cy.createArtist().then((created) => {
      artist = created;
      cy.createAlbum(created.id, {
        album: "First Album",
        art: ["cover.jpg"],
        tracks: [
          { number: 1, title: "Encore", duration: "3:00", disc: 1 },
          { number: 2, title: "Second", duration: "4:00" },
          { number: 1, title: "First", duration: "5:00" },
        ],
      }).then((createdAlbum) => {
        album = createdAlbum;
      });
      cy.createAlbum(created.id, { album: "Second Album" }).then((createdAlbum) => {
        sibling = createdAlbum;
      });
    });
  });

  after(() => {
    cy.purgeFixtures();
  });

  describe("GET /api/albums", () => {
    it("lists albums with their artist and tracks joined", () => {
      cy.api<Array<Album>>("GET", "/albums").then(({ status, body }) => {
        expect(status).to.eq(200);
        const listed = body.find((item) => item.id === album.id);
        expect(listed?.artist.id).to.eq(artist.id);
        expect(listed?.tracks).to.have.length(3);
      });
    });
  });

  describe("POST /api/albums", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("POST", "/albums");
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("POST", "/albums");
    });

    it("rejects an album without tracks", () => {
      cy.api<Cypress.ApiError>("POST", "/albums", {
        auth: true,
        body: albumInput({ tracks: [] }),
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("tracks");
      });
    });

    it("rejects a non-numeric year", () => {
      cy.api<Cypress.ApiError>("POST", "/albums", {
        auth: true,
        body: { ...albumInput(), year: "2001" },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("year");
      });
    });

    it("rejects unknown keys", () => {
      cy.api<Cypress.ApiError>("POST", "/albums", {
        auth: true,
        body: { ...albumInput(), nope: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("nope");
      });
    });

    it("rejects an unknown artist", () => {
      cy.api<Cypress.ApiError>("POST", "/albums", {
        auth: true,
        body: albumInput({ artistId: missingArtistId }),
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.eq(`Artist "${missingArtistId}" does not exist`);
      });
    });

    it("creates an album with a slug id and sorted tracks", () => {
      expect(album.id).to.eq(`${artist.id}-first_album`);
      expect(album.artistId).to.eq(artist.id);
      expect(album.artist.id).to.eq(artist.id);
      expect(album.art).to.deep.eq(["cover.jpg"]);
      expect(album.tracks.map((track) => track.title)).to.deep.eq(["First", "Second", "Encore"]);
    });

    it("rejects a duplicate artist/album with 409", () => {
      cy.api<Cypress.ApiError>("POST", "/albums", {
        auth: true,
        body: albumInput({ album: "First Album" }),
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq("An album with this artist/album already exists");
      });
    });
  });

  describe("GET /api/albums/[id]", () => {
    it("returns the album", () => {
      cy.api<Album>("GET", `/albums/${album.id}`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.deep.eq(album);
      });
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("GET", `/albums/${artist.id}-missing`).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.error).to.eq(`Album "${artist.id}-missing" not found`);
      });
    });
  });

  describe("PATCH /api/albums/[id]", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("PATCH", `/albums/${album.id}`);
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("PATCH", `/albums/${album.id}`);
    });

    it("rejects an empty body", () => {
      cy.api<Cypress.ApiError>("PATCH", `/albums/${album.id}`, { auth: true, body: {} }).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.error).to.contain("at least one field");
        },
      );
    });

    it("rejects unknown keys", () => {
      cy.api<Cypress.ApiError>("PATCH", `/albums/${album.id}`, {
        auth: true,
        body: { nope: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("nope");
      });
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("PATCH", `/albums/${artist.id}-missing`, {
        auth: true,
        body: { year: 1999 },
      }).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.error).to.eq(`Album "${artist.id}-missing" not found`);
      });
    });

    it("updates fields and clears nulls", () => {
      cy.api<Album>("PATCH", `/albums/${album.id}`, {
        auth: true,
        body: { year: 2002, genre: ["Djent"], art: null },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.year).to.eq(2002);
        expect(body.genre).to.deep.eq(["Djent"]);
        expect(body).not.to.have.property("art");
        expect(body.updatedAt).to.be.a("string");
      });
    });

    it("replaces the track list", () => {
      cy.api<Album>("PATCH", `/albums/${album.id}`, {
        auth: true,
        body: { tracks: [{ number: 1, title: "Replacement", duration: "1:00" }] },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.tracks.map((track) => track.title)).to.deep.eq(["Replacement"]);
      });
    });

    it("rejects renaming onto a sibling album with 409", () => {
      cy.api<Cypress.ApiError>("PATCH", `/albums/${album.id}`, {
        auth: true,
        body: { album: sibling.album },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq("An album with this artist/album already exists");
      });
    });

    it("rejects moving the album to an unknown artist", () => {
      cy.api<Cypress.ApiError>("PATCH", `/albums/${album.id}`, {
        auth: true,
        body: { artistId: missingArtistId },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.eq(`Artist "${missingArtistId}" does not exist`);
      });
    });

    it("renames the album, which changes its id", () => {
      const oldId = album.id;
      cy.api<Album>("PATCH", `/albums/${oldId}`, {
        auth: true,
        body: { album: "Renamed Album" },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.id).to.eq(`${artist.id}-renamed_album`);
        expect(body.tracks).to.have.length(1);
        album = body;
      });
      cy.api("GET", `/albums/${oldId}`).its("status").should("eq", 404);
    });
  });

  describe("DELETE /api/albums/[id]", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("DELETE", `/albums/${album.id}`);
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("DELETE", `/albums/${artist.id}-missing`, { auth: true }).then(
        ({ status, body }) => {
          expect(status).to.eq(404);
          expect(body.error).to.eq(`Album "${artist.id}-missing" not found`);
        },
      );
    });

    it("deletes the album", () => {
      cy.api("DELETE", `/albums/${album.id}`, { auth: true }).its("status").should("eq", 204);
      cy.api("GET", `/albums/${album.id}`).its("status").should("eq", 404);
    });
  });
});
