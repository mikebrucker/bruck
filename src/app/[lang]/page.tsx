"use client";

import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/accordion";
import AlbumCard from "@/components/albumCard";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import honorableMentions from "@/data/honorableMentions.json";
import ranked from "@/data/ranked.json";

export default function Home() {
  const { t } = useTranslation();

  const { albums } = ranked;
  const { albums: nonRanked } = honorableMentions;

  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center flex-start font-sans">
      <Header />
      <main className="flex flex-col gap-4 grow items-center max-w-5xl px-4 py-4">
        <Accordion
          title={t(($) => $.albums.ranked)}
          subtitle={t(($) => $.albums.ranked_info)}
          size="xl"
        >
          {albums.map((album) => (
            <AlbumCard key={`ranked-${album.rank}`} album={album} />
          ))}
        </Accordion>
        <Accordion title={t(($) => $.albums.honorable_mentions)} size="xl">
          {nonRanked.map((album) => (
            <AlbumCard key={`hm-${album.rank}`} album={album} />
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
