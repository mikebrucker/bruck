import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

type LocaleLayoutProps = LayoutProps<"/[lang]">;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = (await params) as { lang: string };

  if (!isLocale(lang)) {
    redirect("/");
  }

  return children;
}
