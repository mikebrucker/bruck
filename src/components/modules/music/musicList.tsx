"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCard from "@/components/modules/music/album/albumCard";
import AlbumGridItem from "@/components/modules/music/album/albumGridItem";
import ArtistCard from "@/components/modules/music/artist/artistCard";
import ArtistGridItem from "@/components/modules/music/artist/artistGridItem";
import { MusicFilter } from "@/components/modules/music/musicFilter";
import { MusicViewToggle } from "@/components/modules/music/musicViewToggle";
import { RankBadge, type RankRow } from "@/components/modules/music/rankBadge";
import { ScrollToTopFab } from "@/components/modules/scrollToTopFab";
import { useScrollAncestor } from "@/hooks/useScrollAncestor";
import { indexUnderLine } from "@/lib/dom";
import {
  albumBounds,
  ChipFields,
  ChipModes,
  fieldMatches,
  matchesRanges,
  selectedValuesForField,
} from "@/lib/musicFilter";
import { cn } from "@/lib/utils";
import { useMusicFilterStore } from "@/stores/useMusicFilterStore";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";
import { MusicLists, Views } from "@/types/settings";

type MusicListProps = {
  albums: Array<Album>;
  title: string;
  subtitle?: string;
  filterKey: string;
};

/**
 * The header readout mid-swap. `previous` is absent only on first render, when there is nothing to
 * animate out; `index` is the active card at the last swap, which gives the next swap its direction.
 */
type RankSlide = {
  row: RankRow | null;
  previous?: RankRow | null;
  direction: 1 | -1;
  index: number;
  seq: number;
};

const EMPTY_SET = new Set<string>();

const SCROLL_THRESHOLD_PX = 96;

export function MusicList({ albums, title, subtitle, filterKey }: MusicListProps) {
  const { t } = useTranslation();

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const frameRef = useRef(0);
  const scrollAncestor = useScrollAncestor(rootRef);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const view = useMusicFilterStore((s) => s.view);
  const musicList = useMusicFilterStore((s) => s.musicList);
  const selected = useMusicFilterStore((s) => s.selectedByList[filterKey] ?? EMPTY_SET);
  const storedRankRange = useMusicFilterStore((s) => s.rankRangeByList[filterKey]);
  const storedYearRange = useMusicFilterStore((s) => s.yearRangeByList[filterKey]);
  const storedRuntimeRange = useMusicFilterStore((s) => s.runtimeRangeByList[filterKey]);
  const genreMode =
    useMusicFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.genre]) ?? ChipModes.or;
  const labelMode =
    useMusicFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.label]) ?? ChipModes.or;

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

  const showArtists = musicList === MusicLists.artists;

  const filteredArtists = useMemo(() => {
    const byId = new Map<string, { artist: Artist; rank?: number }>();
    for (const album of filteredAlbums) {
      if (!byId.has(album.artistId)) {
        byId.set(album.artistId, {
          artist: album.artist,
          rank: album.userAlbum?.rank ?? undefined,
        });
      }
    }
    return Array.from(byId.values());
  }, [filteredAlbums]);

  const rows = useMemo<Array<RankRow>>(
    () =>
      showArtists
        ? filteredArtists.map(({ artist, rank }) => ({ id: artist.id, rank, title: artist.artist }))
        : filteredAlbums.map((album) => ({
            id: album.id,
            rank: album.userAlbum?.rank ?? undefined,
            title: album.album,
            subtitle: album.artist.artist,
          })),
    [showArtists, filteredArtists, filteredAlbums],
  );

  const registerCard = (id: string) => (node: HTMLDivElement | null) => {
    if (node) {
      cardRefs.current.set(id, node);
    }

    return () => {
      cardRefs.current.delete(id);
    };
  };

  useEffect(() => {
    if (!scrollAncestor) return;

    const measure = () => {
      frameRef.current = 0;
      setScrolled(scrollAncestor.scrollTop > SCROLL_THRESHOLD_PX);

      // The badge is hidden in grid view, so skip measuring until a toggle back to list re-runs this
      // effect against the taller cards.
      const header = headerRef.current;
      if (!header || view === Views.grid || rows.length === 0) return;

      const cards = rows.map((row) => cardRefs.current.get(row.id));
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
  }, [scrollAncestor, rows, view]);

  const isGrid = view === Views.grid;
  const ArtistItem = isGrid ? ArtistGridItem : ArtistCard;
  const AlbumItem = isGrid ? AlbumGridItem : AlbumCard;

  const cards = showArtists
    ? filteredArtists.map(({ artist, rank }) => (
        <div key={artist.id} ref={registerCard(artist.id)}>
          <ArtistItem artist={artist} albums={albums} rank={rank} />
        </div>
      ))
    : filteredAlbums.map((album) => (
        <div key={album.id} ref={registerCard(album.id)}>
          <AlbumItem album={album} />
        </div>
      ));

  const activeRow = rows[activeIndex] ?? null;

  const [slide, setSlide] = useState<RankSlide>({
    row: activeRow,
    direction: 1,
    index: activeIndex,
    seq: 0,
  });

  // Swap during render so the outgoing and incoming badges start their animations on the same frame.
  if (slide.row?.id !== activeRow?.id) {
    setSlide({
      row: activeRow,
      previous: slide.row,
      direction: activeIndex >= slide.index ? 1 : -1,
      index: activeIndex,
      seq: slide.seq + 1,
    });
  }

  return (
    <div ref={rootRef} className="w-full px-1 relative top-0">
      <div
        ref={headerRef}
        className="flex items-center w-full bg-card border border-border rounded-primary px-2 sm:px-4 pb-1 sm:pb-2 pt-2 sm:pt-4 sticky -top-2 sm:-top-3 z-9 shadow-[0_6px_18px_4px_rgb(0_0_0/0.25),0_2px_8px_2px_rgb(0_0_0/0.15)] dark:shadow-[0_6px_18px_4px_rgb(0_0_0/0.35),0_2px_8px_2px_rgb(0_0_0/0.22)] transition-all"
      >
        <div className="flex flex-1 min-w-0 flex-col py-2 pl-2 pr-1">
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
              scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
            )}
          >
            <div className="min-h-0 overflow-hidden flex flex-col gap-2">
              <h1 className="font-metal-mania font-semibold tracking-widest text-foreground text-base sm:text-2xl transition-[font-size] duration-500">
                {title}
              </h1>
              {subtitle ? (
                <span className="normal-case tracking-normal font-normal text-sm sm:text-base text-muted-foreground transition-[font-size] duration-500">
                  {subtitle}
                </span>
              ) : null}
            </div>
          </div>

          <div
            aria-hidden
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
              scrolled && !isGrid ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden text-theme-600">
              <div className="relative">
                <div
                  key={slide.seq}
                  className={cn(
                    "animate-in fade-in duration-300 ease-out",
                    slide.direction === 1 ? "slide-in-from-bottom-4" : "slide-in-from-top-4",
                  )}
                >
                  <RankBadge row={slide.row} />
                </div>

                {slide.previous !== undefined ? (
                  <div
                    key={`out-${slide.seq}`}
                    className={cn(
                      "absolute inset-0 animate-out fade-out fill-mode-forwards duration-300 ease-out",
                      slide.direction === 1 ? "slide-out-to-top-4" : "slide-out-to-bottom-4",
                    )}
                  >
                    <RankBadge row={slide.previous} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 pr-2">
          <MusicViewToggle scrolled={scrolled} />
        </div>
        <div className="shrink-0 pr-2">
          <MusicFilter albums={albums} filterKey={filterKey} scrolled={scrolled} />
        </div>
      </div>

      {filteredAlbums.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground px-1">
          {t(($) => $.music.filter.no_results)}
        </p>
      ) : null}

      <div
        className={cn(
          "mt-3 gap-3 pb-11.5 sm:pb-13.5 lg:pb-15.5",
          isGrid ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "flex flex-col",
        )}
      >
        {cards}
      </div>

      <ScrollToTopFab />
    </div>
  );
}
