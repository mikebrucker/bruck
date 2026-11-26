import { BrucksProvider } from "@mikebrucker/brucks/ui";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/appLayout";
import { isLocale } from "@/i18n/config";

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = (await params) as { lang: string };

  if (!isLocale(lang)) {
    redirect("/");
  }

  return (
    <BrucksProvider language={lang}>
      <AppLayout adminToken={process.env.ADMIN_TOKEN}>{children}</AppLayout>
    </BrucksProvider>
  );
}
