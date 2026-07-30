"use client";

import { StarAward02Icon, Vynil02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCard from "@/components/modules/album/albumCard";
import { AlbumFilter } from "@/components/modules/album/albumFilter";
import { ScrollToTopFab } from "@/components/modules/scrollToTopFab";
import { useScrollAncestor } from "@/hooks/useScrollAncestor";
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

const SCROLL_THRESHOLD_PX = 96;

/**
 * Index of the first card whose bottom edge sits below `line` — the card the line runs through.
 * Cards are in DOM order, so the predicate is monotonic and a binary search holds. Measures live
 * rects rather than cached offsets because cards contain accordions that resize at any time.
 */
function indexUnderLine(cards: Array<HTMLDivElement | undefined>, line: number) {
  let low = 0;
  let high = cards.length - 1;
  let found = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const card = cards[mid];

    if (!card) break;

    if (card.getBoundingClientRect().bottom > line) {
      found = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return found;
}

export function AlbumList({ albums, title, subtitle, filterKey }: AlbumListProps) {
  const { t } = useTranslation();

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const frameRef = useRef(0);
  const scrollAncestor = useScrollAncestor(rootRef);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    if (!scrollAncestor) return;

    const measure = () => {
      frameRef.current = 0;
      setScrolled(scrollAncestor.scrollTop > SCROLL_THRESHOLD_PX);

      const header = headerRef.current;
      if (!header || filteredAlbums.length === 0) return;

      const cards = filteredAlbums.map((album) => cardRefs.current.get(album.id));
      setActiveIndex(indexUnderLine(cards, header.getBoundingClientRect().bottom));
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(measure);
    };

    measure();
    scrollAncestor.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scrollAncestor.removeEventListener("scroll", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [scrollAncestor, filteredAlbums]);

  const activeRank = filteredAlbums[activeIndex]?.userAlbum?.rank;

  return (
    <div ref={rootRef} className="w-full px-1 relative top-0">
      <div
        ref={headerRef}
        className="flex items-center w-full bg-card border border-border rounded-lg p-2 sm:p-4 sticky -top-3 sm:-top-5 z-9 shadow-[0_6px_18px_4px_rgb(0_0_0/0.25),0_2px_8px_2px_rgb(0_0_0/0.15)] dark:shadow-[0_6px_18px_4px_rgb(0_0_0/0.35),0_2px_8px_2px_rgb(0_0_0/0.22)]"
      >
        <div className="flex flex-1 min-w-0 flex-col p-2">
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
              scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
            )}
          >
            <div className="min-h-0 overflow-hidden flex flex-col gap-2">
              <span className="font-metal-mania font-semibold tracking-widest text-foreground sm:text-2xl transition-[font-size] duration-500">
                {title}
              </span>
              {subtitle ? (
                <span className="normal-case tracking-normal font-normal text-xs sm:text-base text-muted-foreground transition-[font-size] duration-500">
                  {subtitle}
                </span>
              ) : null}
            </div>
          </div>

          <div
            aria-hidden
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
              scrolled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden text-theme-600">
              {activeRank ? (
                <div className="flex items-center">
                  <HugeiconsIcon icon={StarAward02Icon} className="w-7 h-7 sm:w-8 sm:h-8" />
                  <span className="font-mono font-bold tabular-nums leading-none text-2xl sm:text-3xl">
                    {activeRank}
                  </span>
                </div>
              ) : (
                <HugeiconsIcon icon={Vynil02Icon} className="w-7 h-7 sm:w-8 sm:h-8" />
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 pr-2">
          <AlbumFilter albums={albums} filterKey={filterKey} />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 pb-11.5 sm:pb-13.5 lg:pb-15.5">
        {filteredAlbums.length === 0 ? (
          <p className="text-sm text-muted-foreground px-1">{t(($) => $.albums.no_results)}</p>
        ) : null}

        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            ref={(node) => {
              if (node) {
                cardRefs.current.set(album.id, node);
              }

              return () => {
                cardRefs.current.delete(album.id);
              };
            }}
          >
            <AlbumCard album={album} />
          </div>
        ))}
      </div>

      <ScrollToTopFab />
    </div>
  );
}
