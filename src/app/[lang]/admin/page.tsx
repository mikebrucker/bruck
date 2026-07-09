import { notFound } from "next/navigation";
import { AdminAlbumForm } from "@/components/modules/album/admin/adminAlbumForm";

export default function AdminPage() {
  if (!process.env.ADMIN_TOKEN) {
    notFound();
  }

  return <AdminAlbumForm />;
}
