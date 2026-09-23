/** Postgres SQLSTATE codes surfaced to the API as 409s */
export const PgErrors = {
  uniqueViolation: "23505",
  foreignKeyViolation: "23503",
  /** Raised instead of foreignKeyViolation when an ON DELETE RESTRICT reference blocks a delete */
  restrictViolation: "23001",
} as const;
export type PgError = keyof typeof PgErrors;

/** Walks the cause chain since drizzle wraps driver errors in DrizzleQueryError */
export function isPgError(error: unknown, code: (typeof PgErrors)[PgError]): boolean {
  if (!(error instanceof Error)) return false;
  if ("code" in error && error.code === code) return true;
  return isPgError(error.cause, code);
}
