"use client";

import { Close, Menu } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/accordion";
import AlbumCard from "@/components/albumCard";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import honorableMentions from "@/data/honorableMentions.json";
import ranked from "@/data/ranked.json";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function Home() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lang = useLanguageStore((s) => s.language);

  const { albums } = ranked;
  const { albums: nonRanked } = honorableMentions;

  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center flex-start font-sans">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right">
        <div className="flex justify-end px-4 py-3 border-b ">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDrawerOpen(false)}
            aria-label={"close menu"}
            className="rounded-sm"
          >
            <HugeiconsIcon icon={Close} className="size-6" />
          </Button>
        </div>
        <nav className="flex flex-col">
          <Link
            href="/mike-brucker-cv.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDrawerOpen(false)}
            className="border-b text-lg font-medium hover:bg-theme-300 transition-colors duration-250 px-4 py-3"
          >
            {t(($) => $.menu.cv)} - HTML
          </Link>
          <Link
            href="/mike-brucker-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDrawerOpen(false)}
            className="border-b text-lg font-medium hover:bg-theme-300 transition-colors duration-250 px-4 py-3"
          >
            {t(($) => $.menu.cv)} - PDF
          </Link>
        </nav>
      </Drawer>
      <Header onAction={() => setDrawerOpen(true)} actionIcon={Menu} />
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
