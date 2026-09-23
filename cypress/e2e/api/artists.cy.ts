import type { Artist } from "@/types/artist";

describe("/api/artists", () => {
  const missingId = "e2e_fixture_missing";
  let artist: Artist;
  let other: Artist;

  before(() => {
    cy.purgeFixtures();
    cy.createArtist({ bio: "Initial bio", location: "Nowhere" }).then((created) => {
      artist = created;
    });
    cy.createArtist().then((created) => {
      other = created;
    });
  });

  after(() => {
    cy.purgeFixtures();
  });

  describe("GET /api/artists", () => {
    it("lists artists including the fixture", () => {
      cy.api<Array<Artist>>("GET", "/artists").then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.map((item) => item.id)).to.include(artist.id);
      });
    });
  });

  describe("POST /api/artists", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("POST", "/artists");
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("POST", "/artists");
    });

    it("rejects a body without an artist name", () => {
      cy.api<Cypress.ApiError>("POST", "/artists", { auth: true, body: { bio: "No name" } }).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.error).to.contain("artist");
        },
      );
    });

    it("rejects unknown keys", () => {
      cy.api<Cypress.ApiError>("POST", "/artists", {
        auth: true,
        body: { artist: "E2E Fixture Unknown Key", nope: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("nope");
      });
    });

    it("creates an artist with a slug id", () => {
      expect(artist.id).to.eq(artist.artist.toLowerCase().replaceAll(" ", "_"));
      expect(artist.bio).to.eq("Initial bio");
      expect(artist.location).to.eq("Nowhere");
      expect(artist.createdAt).to.be.a("string");
      expect(artist).not.to.have.property("updatedAt");
    });

    it("rejects a duplicate name with 409", () => {
      cy.api<Cypress.ApiError>("POST", "/artists", {
        auth: true,
        body: { artist: artist.artist },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq("An artist with this name already exists");
      });
    });
  });

  describe("GET /api/artists/[id]", () => {
    it("returns the artist", () => {
      cy.api<Artist>("GET", `/artists/${artist.id}`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.deep.eq(artist);
      });
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("GET", `/artists/${missingId}`).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.error).to.eq(`Artist "${missingId}" not found`);
      });
    });
  });

  describe("PATCH /api/artists/[id]", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("PATCH", `/artists/${artist.id}`);
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("PATCH", `/artists/${artist.id}`);
    });

    it("rejects an empty body", () => {
      cy.api<Cypress.ApiError>("PATCH", `/artists/${artist.id}`, { auth: true, body: {} }).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.error).to.contain("at least one field");
        },
      );
    });

    it("rejects unknown keys", () => {
      cy.api<Cypress.ApiError>("PATCH", `/artists/${artist.id}`, {
        auth: true,
        body: { nope: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("nope");
      });
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("PATCH", `/artists/${missingId}`, {
        auth: true,
        body: { bio: "Ghost" },
      }).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.error).to.eq(`Artist "${missingId}" not found`);
      });
    });

    it("updates fields and clears nulls", () => {
      cy.api<Artist>("PATCH", `/artists/${artist.id}`, {
        auth: true,
        body: { bio: "Updated bio", location: null },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.id).to.eq(artist.id);
        expect(body.bio).to.eq("Updated bio");
        expect(body).not.to.have.property("location");
        expect(body.updatedAt).to.be.a("string");
      });
    });

    it("rejects renaming onto an existing artist with 409", () => {
      cy.api<Cypress.ApiError>("PATCH", `/artists/${artist.id}`, {
        auth: true,
        body: { artist: other.artist },
      }).then(({ status, body }) => {
        expect(status).to.eq(409);
        expect(body.error).to.eq("An artist with this name already exists");
      });
    });

    it("renames the artist, which changes its id", () => {
      const oldId = artist.id;
      cy.api<Artist>("PATCH", `/artists/${oldId}`, {
        auth: true,
        body: { artist: `${artist.artist} Renamed` },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.id).to.eq(`${oldId}_renamed`);
        artist = body;
      });
      cy.api("GET", `/artists/${oldId}`).its("status").should("eq", 404);
    });
  });

  describe("DELETE /api/artists/[id]", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("DELETE", `/artists/${artist.id}`);
    });

    it("returns 404 for an unknown id", () => {
      cy.api<Cypress.ApiError>("DELETE", `/artists/${missingId}`, { auth: true }).then(
        ({ status, body }) => {
          expect(status).to.eq(404);
          expect(body.error).to.eq(`Artist "${missingId}" not found`);
        },
      );
    });

    it("refuses to delete an artist that still has albums", () => {
      cy.createAlbum(artist.id).then((album) => {
        cy.api<Cypress.ApiError>("DELETE", `/artists/${artist.id}`, { auth: true }).then(
          ({ status, body }) => {
            expect(status).to.eq(409);
            expect(body.error).to.eq(
              `Artist "${artist.id}" still has albums; delete or reassign them first`,
            );
          },
        );
        cy.api("DELETE", `/albums/${album.id}`, { auth: true }).its("status").should("eq", 204);
      });
    });

    it("deletes the artist", () => {
      cy.api("DELETE", `/artists/${other.id}`, { auth: true }).its("status").should("eq", 204);
      cy.api("GET", `/artists/${other.id}`).its("status").should("eq", 404);
    });
  });
});
