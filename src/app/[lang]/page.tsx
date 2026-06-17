"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/accordion";
import AlbumCard from "@/components/albumCard";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Menu } from "@/components/partials/menu";
import honorableMentions from "@/data/honorableMentions.json";
import ranked from "@/data/ranked.json";

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
          duration={1500}
        >
          {ranked.albums.map((album) => (
            <AlbumCard key={`ranked-${album.rank}`} album={album} />
          ))}
        </Accordion>
        <Accordion
          title={t(($) => $.albums.honorable_mentions)}
          size="xl"
          classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
          duration={1000}
        >
          {honorableMentions.albums.map((album) => (
            <AlbumCard key={`hm-${album.rank}`} album={album} />
          ))}
        </Accordion>
      </main>
      <Footer sticky />
    </div>
  );
}
