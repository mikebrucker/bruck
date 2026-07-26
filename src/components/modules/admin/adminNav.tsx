"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminNavProps {
  lang: string;
}

export function AdminNav({ lang }: AdminNavProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const active = pathname.startsWith(`/${lang}/admin/user-album`) ? "user-album" : "album";

  return (
    <Tabs value={active} onValueChange={() => {}} className="self-center">
      <TabsList>
        <TabsTrigger asChild value="album">
          <Link href={`/${lang}/admin/album/`}>{t(($) => $.admin.nav.album)}</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="user-album">
          <Link href={`/${lang}/admin/user-album/`}>{t(($) => $.admin.nav.user_album)}</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
