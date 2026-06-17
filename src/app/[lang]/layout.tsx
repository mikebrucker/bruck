import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = (await params) as { lang: string };

  if (!isLocale(lang)) {
    redirect("/");
  }

  return children;
}
