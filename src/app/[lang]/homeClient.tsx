"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AlbumList } from "@/components/modules/albumList";
import { Menu } from "@/components/modules/menu";
import type { Album } from "@/types/album";

type HomeClientProps = {
  rankedAlbums: Array<Album>;
  honorableMentionAlbums: Array<Album>;
};

export function HomeClient({ rankedAlbums, honorableMentionAlbums }: HomeClientProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh items-center flex-start font-sans">
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
      <Header onAction={() => setMenuOpen(true)} actionIcon={Menu01Icon} sticky />
      <main className="flex flex-col gap-4 grow items-center max-w-5xl p-1 sm:p-4 transition-all">
        <AlbumList
          albums={rankedAlbums}
          title={t(($) => $.albums.ranked)}
          subtitle={t(($) => $.albums.ranked_info)}
          showRank
        />
        <AlbumList albums={honorableMentionAlbums} title={t(($) => $.albums.honorable_mentions)} />
      </main>
      <Footer sticky />
    </div>
  );
}
