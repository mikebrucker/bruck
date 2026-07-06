import { redirect } from "next/navigation";
import { defaultRoute } from "@/i18n/config";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  redirect(`/${lang}/${defaultRoute}`);
}
