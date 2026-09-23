import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "cypress";
import { config, parse } from "dotenv";

/** Hostname of DATABASE_URL in an env file, or null when the file or key is missing */
function databaseHost(file: string): string | null {
  if (!existsSync(file)) return null;
  const url = parse(readFileSync(file)).DATABASE_URL;
  return url ? new URL(url).hostname : null;
}

// API specs write real rows, so refuse to run unless .env.test targets its own Neon branch
const testHost = databaseHost(".env.test");
if (!testHost) {
  throw new Error(".env.test must set DATABASE_URL to a Neon test branch");
}
if (testHost === databaseHost(".env")) {
  throw new Error(".env.test DATABASE_URL points at the same host as .env; refusing to run");
}

config({ path: [".env.test", ".env"], quiet: true });

export default defineConfig({
  env: { ADMIN_TOKEN: process.env.ADMIN_TOKEN },
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: "http://localhost:3100",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
  },
});
