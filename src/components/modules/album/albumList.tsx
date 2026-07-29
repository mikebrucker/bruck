"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCard from "@/components/modules/album/albumCard";
import { AlbumFilter } from "@/components/modules/album/albumFilter";
import { ScrollToTopFab } from "@/components/modules/scrollToTopFab";
import {
  albumBounds,
  ChipFields,
  ChipModes,
  fieldMatches,
  matchesRanges,
  selectedValuesForField,
} from "@/lib/albumFilter";
import { cn } from "@/lib/utils";
import { useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import type { Album } from "@/types/album";

type AlbumListProps = {
  albums: Array<Album>;
  title: string;
  subtitle?: string;
  filterKey: string;
};

const EMPTY_SET = new Set<string>();

export function AlbumList({ albums, title, subtitle, filterKey }: AlbumListProps) {
  const { t } = useTranslation();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setScrolled(!entry.isIntersecting);
      },
      { threshold: 1 },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const selected = useAlbumFilterStore((s) => s.selectedByList[filterKey] ?? EMPTY_SET);
  const storedRankRange = useAlbumFilterStore((s) => s.rankRangeByList[filterKey]);
  const storedYearRange = useAlbumFilterStore((s) => s.yearRangeByList[filterKey]);
  const storedRuntimeRange = useAlbumFilterStore((s) => s.runtimeRangeByList[filterKey]);
  const genreMode =
    useAlbumFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.genre]) ?? ChipModes.or;
  const labelMode =
    useAlbumFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.label]) ?? ChipModes.or;

  const bounds = useMemo(() => albumBounds(albums), [albums]);

  const rankRange = storedRankRange ?? bounds.rankRange;
  const yearRange = storedYearRange ?? bounds.yearRange;
  const runtimeRange = storedRuntimeRange ?? bounds.runtimeRange;

  const genreValues = useMemo(() => selectedValuesForField(selected, ChipFields.genre), [selected]);
  const labelValues = useMemo(() => selectedValuesForField(selected, ChipFields.label), [selected]);

  const filteredAlbums = useMemo(
    () =>
      albums.filter(
        (album) =>
          fieldMatches(genreValues, genreMode, album.genre) &&
          fieldMatches(labelValues, labelMode, album.label) &&
          matchesRanges(album, { rankRange, yearRange, runtimeRange }),
      ),
    [albums, genreValues, genreMode, labelValues, labelMode, rankRange, yearRange, runtimeRange],
  );

  return (
    <div className="w-full px-1 relative top-0">
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <div
        className={cn(
          "flex items-center w-full bg-card border border-border rounded-lg p-2 sm:p-4 sticky -top-3 sm:-top-5 z-50 shadow-[0_6px_18px_4px_rgb(0_0_0/0.25),0_2px_8px_2px_rgb(0_0_0/0.15)] dark:shadow-[0_6px_18px_4px_rgb(0_0_0/0.35),0_2px_8px_2px_rgb(0_0_0/0.22)]",
          scrolled ? "pb-0!" : "",
        )}
      >
        <div
          className={cn(
            "flex flex-1 min-w-0 flex-col p-2 transition-all duration-300 ease-out",
            scrolled ? "gap-0.5" : "gap-2",
          )}
        >
          <span
            className={cn(
              "font-metal-mania font-semibold tracking-widest text-foreground transition-all duration-300 ease-out",
              scrolled ? "sm:text-lg" : "text-2xl",
            )}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              className={cn(
                "normal-case tracking-normal font-normal text-muted-foreground transition-all duration-300 ease-out",
                scrolled ? "text-xs" : "text-base",
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
        <div className="shrink-0 pr-2">
          <AlbumFilter albums={albums} filterKey={filterKey} />
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-3">
        {filteredAlbums.length === 0 ? (
          <p className="text-sm text-muted-foreground px-1">{t(($) => $.albums.no_results)}</p>
        ) : null}

        {filteredAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>

      <ScrollToTopFab />
    </div>
  );
}
