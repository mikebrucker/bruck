import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";

describe("/api/user-albums", () => {
  const missingAlbumId = "e2e_fixture_missing-album";
  let first: Album;
  let second: Album;
  let untouched: Album;

  const findRow = (rows: Array<UserAlbum>, albumId: string) =>
    rows.find((row) => row.albumId === albumId);

  before(() => {
    cy.purgeFixtures();
    cy.createArtist().then((artist) => {
      cy.createAlbum(artist.id).then((album) => {
        first = album;
      });
      cy.createAlbum(artist.id).then((album) => {
        second = album;
      });
      cy.createAlbum(artist.id).then((album) => {
        untouched = album;
      });
    });
  });

  after(() => {
    cy.purgeFixtures();
  });

  describe("GET /api/user-albums", () => {
    it("lists the user's album rows", () => {
      cy.api<Array<UserAlbum>>("GET", "/user-albums").then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.be.an("array");
      });
    });
  });

  describe("PATCH /api/user-albums/[albumId]", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("PATCH", `/user-albums/${first.id}`);
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("PATCH", `/user-albums/${first.id}`);
    });

    it("rejects an empty body", () => {
      cy.api<Cypress.ApiError>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: {},
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("at least one field");
      });
    });

    it("rejects unknown keys and invalid ranks", () => {
      const invalidBodies = [{ nope: true }, { rank: 0 }, { rank: 1.5 }];
      for (const invalid of invalidBodies) {
        cy.api("PATCH", `/user-albums/${first.id}`, { auth: true, body: invalid })
          .its("status")
          .should("eq", 400);
      }
    });

    it("returns 404 for an unknown album", () => {
      cy.api<Cypress.ApiError>("PATCH", `/user-albums/${missingAlbumId}`, {
        auth: true,
        body: { review: "Ghost" },
      }).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.error).to.eq(`Album "${missingAlbumId}" not found`);
      });
    });

    it("sets the favorite track", () => {
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { trackId: "1:0" },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.albumId).to.eq(first.id);
        expect(body.trackId).to.eq("1:0");
      });
    });

    it("sets a review without touching other fields", () => {
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { review: "Great" },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.review).to.eq("Great");
        expect(body.trackId).to.eq("1:0");
      });
    });

    it("stores an empty review as null", () => {
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { review: "" },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.review).to.eq(null);
      });
    });

    it("marks the album honorable", () => {
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { honorable: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.honorable).to.eq(true);
      });
    });

    it("refuses to rank an honorable album", () => {
      cy.api<Cypress.ApiError>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { rank: 9001 },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq(
          `Album "${first.id}" is an honorable mention and cannot be ranked`,
        );
      });
    });

    it("ranks the album once it is no longer honorable", () => {
      cy.api("PATCH", `/user-albums/${first.id}`, { auth: true, body: { honorable: false } })
        .its("status")
        .should("eq", 200);
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { rank: 9001 },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.rank).to.eq(9001);
        expect(body.honorable).to.eq(false);
      });
    });

    it("refuses to mark a ranked album honorable", () => {
      cy.api<Cypress.ApiError>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { honorable: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq(`Album "${first.id}" is ranked and cannot be marked honorable`);
      });
    });

    it("clears the rank with null", () => {
      cy.api<UserAlbum>("PATCH", `/user-albums/${first.id}`, {
        auth: true,
        body: { rank: null },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.rank).to.eq(null);
      });
    });

    it("writes nothing when a combined update conflicts", () => {
      cy.api("PATCH", `/user-albums/${untouched.id}`, {
        auth: true,
        body: { honorable: true, rank: 1 },
      })
        .its("status")
        .should("eq", 409);
      cy.api<Array<UserAlbum>>("GET", "/user-albums").then(({ body }) => {
        expect(findRow(body, untouched.id)).to.eq(undefined);
      });
    });
  });

  describe("PATCH /api/user-albums", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("PATCH", "/user-albums");
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("PATCH", "/user-albums");
    });

    it("rejects empty updates, missing album ids and unknown keys", () => {
      const invalidBodies = [
        { updates: [] },
        { updates: [{ review: "No album" }] },
        { updates: [{ albumId: first.id, nope: true }] },
      ];
      for (const invalid of invalidBodies) {
        cy.api("PATCH", "/user-albums", { auth: true, body: invalid })
          .its("status")
          .should("eq", 400);
      }
    });

    it("rejects an unknown album without writing the valid ones", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user-albums", {
        auth: true,
        body: {
          updates: [
            { albumId: untouched.id, review: "Should not persist" },
            { albumId: missingAlbumId, review: "Ghost" },
          ],
        },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.eq(`Album "${missingAlbumId}" not found`);
      });
      cy.api<Array<UserAlbum>>("GET", "/user-albums").then(({ body }) => {
        expect(findRow(body, untouched.id)).to.eq(undefined);
      });
    });

    it("rejects the same album twice in one update", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user-albums", {
        auth: true,
        body: {
          updates: [
            { albumId: first.id, review: "One" },
            { albumId: first.id, review: "Two" },
          ],
        },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq(`Album "${first.id}" appears more than once in the same update`);
      });
    });

    it("upserts several albums and keeps unpatched fields", () => {
      cy.api<Array<UserAlbum>>("PATCH", "/user-albums", {
        auth: true,
        body: {
          updates: [
            { albumId: first.id, review: "Bulk review" },
            { albumId: second.id, rank: 42 },
          ],
        },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.length(2);
        expect(findRow(body, first.id)?.review).to.eq("Bulk review");
        expect(findRow(body, first.id)?.trackId).to.eq("1:0");
        expect(findRow(body, second.id)?.rank).to.eq(42);
      });
    });

    it("rejects a merged row that would be ranked and honorable", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user-albums", {
        auth: true,
        body: { updates: [{ albumId: second.id, honorable: true }] },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq(`Album "${second.id}" is ranked and cannot be marked honorable`);
      });
    });

    it("reflects the bulk result in GET", () => {
      cy.api<Array<UserAlbum>>("GET", "/user-albums").then(({ body }) => {
        expect(findRow(body, first.id)?.review).to.eq("Bulk review");
        expect(findRow(body, second.id)?.rank).to.eq(42);
        expect(findRow(body, second.id)?.honorable).to.eq(false);
      });
    });
  });
});
