import type { User } from "@/types/user";

describe("/api/user", () => {
  let originalSettings: Record<string, unknown>;

  before(() => {
    cy.api<User>("GET", "/user").then(({ body }) => {
      originalSettings = body.settings;
    });
  });

  after(() => {
    cy.api("PATCH", "/user", { auth: true, body: { settings: originalSettings } })
      .its("status")
      .should("eq", 200);
  });

  describe("GET /api/user", () => {
    it("returns the single user with settings", () => {
      cy.api<User>("GET", "/user").then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.id).to.eq("me");
        expect(body.settings).to.be.an("object");
      });
    });
  });

  describe("PATCH /api/user", () => {
    it("rejects missing or invalid auth", () => {
      cy.expectUnauthorized("PATCH", "/user");
    });

    it("rejects a malformed JSON body", () => {
      cy.expectInvalidJson("PATCH", "/user");
    });

    it("rejects a body without settings", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user", { auth: true, body: {} }).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.error).to.contain("settings");
        },
      );
    });

    it("rejects settings that are not an object", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user", { auth: true, body: { settings: ["dark"] } }).then(
        ({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.error).to.contain("settings");
        },
      );
    });

    it("rejects unknown top-level keys", () => {
      cy.api<Cypress.ApiError>("PATCH", "/user", {
        auth: true,
        body: { settings: {}, nope: true },
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.error).to.contain("nope");
      });
    });

    it("replaces the whole settings object", () => {
      const settings = { e2eMarker: Date.now(), nested: { flag: true } };
      cy.api<User>("PATCH", "/user", { auth: true, body: { settings } }).then(
        ({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.settings).to.deep.eq(settings);
          expect(body.updatedAt).to.be.a("string");
        },
      );
      cy.api<User>("GET", "/user").its("body.settings").should("deep.eq", settings);
    });
  });
});
