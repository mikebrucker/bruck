"use client";

import {
  Close,
  HtmlFile02FreeIcons,
  Menu,
  Moon01Icon,
  Pdf02FreeIcons,
  Sun,
} from "@hugeicons/core-free-icons";
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
import { useThemeStore } from "@/stores/useThemeStore";

export default function Home() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lang = useLanguageStore((s) => s.language);
  const { theme, toggle } = useThemeStore();

  return (
    <div className="flex flex-col min-h-dvh items-center flex-start font-sans">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" useTheme>
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
          <button
            type="button"
            onClick={toggle}
            className="border-b text-lg font-medium hover:bg-theme-300 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer"
          >
            <HugeiconsIcon icon={theme === "dark" ? Moon01Icon : Sun} className="size-6" />
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </button>
          <Link
            href="/mike-brucker-cv.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDrawerOpen(false)}
            className="border-b text-lg font-medium hover:bg-theme-300 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer"
          >
            <HugeiconsIcon icon={HtmlFile02FreeIcons} className="size-6" />
            {t(($) => $.menu.cv)} - HTML
          </Link>
          <Link
            href="/mike-brucker-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDrawerOpen(false)}
            className="border-b text-lg font-medium hover:bg-theme-300 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer"
          >
            <HugeiconsIcon icon={Pdf02FreeIcons} className="size-6" />
            {t(($) => $.menu.cv)} - PDF
          </Link>
        </nav>
      </Drawer>
      <Header onAction={() => setDrawerOpen(true)} actionIcon={Menu} sticky />
      <main className="flex flex-col gap-4 grow items-center max-w-5xl p-1 sm:p-4 transition-all">
        <Accordion
          title={t(($) => $.albums.ranked)}
          subtitle={t(($) => $.albums.ranked_info)}
          size="xl"
          classNames="hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-1"
          duration={1500}
        >
          {ranked.albums.map((album) => (
            <AlbumCard key={`ranked-${album.rank}`} album={album} />
          ))}
        </Accordion>
        <Accordion
          title={t(($) => $.albums.honorable_mentions)}
          size="xl"
          classNames="hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-1"
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
