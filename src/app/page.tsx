import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, defaultRoute, isLocale } from "@/i18n/config";

export default async function Page() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const preferredLanguage = acceptLanguage.split(",")[0]?.trim().slice(0, 2) ?? "";
  const lang = isLocale(preferredLanguage) ? preferredLanguage : defaultLocale;
  redirect(`/${lang}/${defaultRoute}`);
}
