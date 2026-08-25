/** Postgres SQLSTATE codes surfaced to the API as 409s */
export const PgErrors = {
  uniqueViolation: "23505",
  foreignKeyViolation: "23503",
} as const;
export type PgError = keyof typeof PgErrors;

export function isPgError(error: unknown, code: (typeof PgErrors)[PgError]): boolean {
  return error instanceof Error && "code" in error && error.code === code;
}
