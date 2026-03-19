import { redirect } from "next/navigation";

export default async function CatchAllPage({
  params,
}: PageProps<"/[lang]/[...slug]">) {
  const { lang } = await params;
  redirect(`/${lang}`);
}
