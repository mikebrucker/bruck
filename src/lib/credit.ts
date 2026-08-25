import type { Credit, CreditForm } from "@/types/album";

export const emptyCredit = (): CreditForm => ({ name: "", roles: "", notes: "" });

export function parseList(value: string): Array<string> {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toCredit(credit: CreditForm): Credit {
  return {
    name: credit.name.trim(),
    roles: parseList(credit.roles),
    notes: credit.notes.trim() || undefined,
  };
}

export function toCreditList(credits: Array<CreditForm>): Array<Credit> | undefined {
  const named = credits.filter((credit) => credit.name.trim() !== "");
  return named.length > 0 ? named.map(toCredit) : undefined;
}

export function creditToForm(credit: Credit): CreditForm {
  return { name: credit.name, roles: credit.roles.join(", "), notes: credit.notes ?? "" };
}
