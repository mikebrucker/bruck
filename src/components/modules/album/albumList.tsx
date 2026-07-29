"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import AlbumCard from "@/components/modules/album/albumCard";
import { AlbumFilter } from "@/components/modules/album/albumFilter";
import {
  albumBounds,
  ChipFields,
  ChipModes,
  fieldMatches,
  matchesRanges,
  selectedValuesForField,
} from "@/lib/albumFilter";
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
    <div className="w-full px-1">
      <div className="flex items-center w-full">
        <div className="flex flex-1 min-w-0 flex-col gap-2 p-2">
          <span className="font-metal-mania text-2xl font-semibold tracking-widest text-foreground">
            {title}
          </span>
          {subtitle ? (
            <span className="normal-case tracking-normal font-normal text-base text-muted-foreground">
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
    </div>
  );
}
