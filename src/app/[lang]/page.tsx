"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import AlbumCard from "@/components/modules/albumCard";
import { Menu } from "@/components/modules/menu";
import { Accordion } from "@/components/ui/accordion";
import { sortByRank } from "@/data/albumOrder";
import { honorableMentionAlbums, rankedAlbums } from "@/data/albums";

export default function Home() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh items-center flex-start font-sans">
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
      <Header onAction={() => setMenuOpen(true)} actionIcon={Menu01Icon} sticky />
      <main className="flex flex-col gap-4 grow items-center max-w-5xl p-1 sm:p-4 transition-all">
        <Accordion
          title={t(($) => $.albums.ranked)}
          subtitle={t(($) => $.albums.ranked_info)}
          size="xl"
          classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
          duration={1000}
        >
          {sortByRank(rankedAlbums).map((album, i) => (
            <AlbumCard key={`ranked-${album.id}`} rank={i + 1} album={album} />
          ))}
        </Accordion>
        <Accordion
          title={t(($) => $.albums.honorable_mentions)}
          size="xl"
          classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
          duration={1000}
        >
          {sortByRank(honorableMentionAlbums).map((album) => (
            <AlbumCard key={`hm-${album.id}`} album={album} />
          ))}
        </Accordion>
      </main>
      <Footer sticky />
    </div>
  );
}
