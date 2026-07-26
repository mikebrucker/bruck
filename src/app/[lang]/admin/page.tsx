import { redirect } from "next/navigation";

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  redirect(`/${lang}/admin/album/`);
}
