import { notFound } from "next/navigation";
import { AdminNav } from "@/components/modules/admin/adminNav";

export default async function AdminLayout({ children, params }: LayoutProps<"/[lang]/admin">) {
  if (!process.env.ADMIN_TOKEN) {
    notFound();
  }

  const { lang } = await params;

  return (
    <div className="w-full flex flex-col gap-4">
      <AdminNav lang={lang} />
      {children}
    </div>
  );
}
