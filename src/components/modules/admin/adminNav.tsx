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
  const sections = ["user-album", "artist", "album"] as const;
  const active =
    sections.find((section) => pathname.startsWith(`/${lang}/admin/${section}`)) ?? "album";

  return (
    <Tabs value={active} onValueChange={() => {}} className="self-center">
      {/* biome-ignore lint/a11y/useValidAriaRole: role={undefined} overrides role="tab" for links */}
      <TabsList role={undefined} tabIndex={-1}>
        {/* biome-ignore lint/a11y/useValidAriaRole: role={undefined} overrides role="tab" for links */}
        <TabsTrigger
          asChild
          value="album"
          role={undefined}
          type={undefined}
          tabIndex={0}
          aria-selected={undefined}
          aria-controls={undefined}
        >
          <Link
            href={`/${lang}/admin/album/`}
            aria-current={active === "album" ? "page" : undefined}
          >
            {t(($) => $.admin.nav.album)}
          </Link>
        </TabsTrigger>
        {/* biome-ignore lint/a11y/useValidAriaRole: role={undefined} overrides role="tab" for links */}
        <TabsTrigger
          asChild
          value="artist"
          role={undefined}
          type={undefined}
          tabIndex={0}
          aria-selected={undefined}
          aria-controls={undefined}
        >
          <Link
            href={`/${lang}/admin/artist/`}
            aria-current={active === "artist" ? "page" : undefined}
          >
            {t(($) => $.admin.nav.artist)}
          </Link>
        </TabsTrigger>
        {/* biome-ignore lint/a11y/useValidAriaRole: role={undefined} overrides role="tab" for links */}
        <TabsTrigger
          asChild
          value="user-album"
          role={undefined}
          type={undefined}
          tabIndex={0}
          aria-selected={undefined}
          aria-controls={undefined}
        >
          <Link
            href={`/${lang}/admin/user-album/`}
            aria-current={active === "user-album" ? "page" : undefined}
          >
            {t(($) => $.admin.nav.user_album)}
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
