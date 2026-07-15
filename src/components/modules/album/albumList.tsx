"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import AlbumCard from "@/components/modules/album/albumCard";
import { AlbumFilter } from "@/components/modules/album/albumFilter";
import { parseRuntimeSeconds } from "@/lib/album";
import { type ChipMode, ChipModes, useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";

type AlbumListProps = {
  albums: Array<Album>;
  userAlbums: Array<UserAlbum>;
  title: string;
  subtitle?: string;
  showRank?: boolean;
  filterKey: string;
};

const ChipFields = {
  genre: "genre",
  label: "label",
} as const;
type ChipField = keyof typeof ChipFields;

const EMPTY_SET = new Set<string>();

const selectedValuesForField = (selected: Set<string>, field: ChipField): Array<string> => {
  const prefix = `${field}:`;
  return Array.from(selected)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length));
};

const fieldMatches = (values: Array<string>, mode: ChipMode, albumValue: string): boolean =>
  values.length === 0 ||
  (mode === ChipModes.and ? values.every((v) => v === albumValue) : values.includes(albumValue));

export function AlbumList({
  albums,
  userAlbums,
  title,
  subtitle,
  showRank,
  filterKey,
}: AlbumListProps) {
  const { t } = useTranslation();

  const selected = useAlbumFilterStore((s) => s.selectedByList[filterKey] ?? EMPTY_SET);
  const storedYearRange = useAlbumFilterStore((s) => s.yearRangeByList[filterKey]);
  const storedRuntimeRange = useAlbumFilterStore((s) => s.runtimeRangeByList[filterKey]);
  const chipMode = useAlbumFilterStore((s) => s.chipModeByList[filterKey]) ?? ChipModes.or;

  const yearBounds = useMemo((): [number, number] => {
    const years = albums.map((album) => album.year);
    return [Math.min(...years), Math.max(...years)];
  }, [albums]);

  const runtimeBounds = useMemo((): [number, number] => {
    const seconds = albums.map((album) => parseRuntimeSeconds(album.runtime));
    return [Math.min(...seconds), Math.max(...seconds)];
  }, [albums]);

  const yearRange = storedYearRange ?? yearBounds;
  const runtimeRange = storedRuntimeRange ?? runtimeBounds;

  const genreValues = useMemo(
    () => selectedValuesForField(selected, ChipFields.genre),
    [selected],
  );
  const labelValues = useMemo(
    () => selectedValuesForField(selected, ChipFields.label),
    [selected],
  );

  const rankedAlbums = useMemo(
    () => albums.map((album, i) => ({ album, rank: showRank ? i + 1 : undefined })),
    [albums, showRank],
  );

  const filteredAlbums = useMemo(() => {
    return rankedAlbums.filter(({ album }) => {
      const fieldsList: Array<{ values: Array<string>; albumValue: string }> = [
        { values: genreValues, albumValue: album.genre },
        { values: labelValues, albumValue: album.label },
      ];

      let andOk = true;
      let orPoolActive = false;
      let orPoolMatch = false;
      for (const { values, albumValue } of fieldsList) {
        if (values.length === 0) continue;
        const matches = fieldMatches(values, chipMode, albumValue);
        if (chipMode === ChipModes.and) {
          andOk = andOk && matches;
        } else {
          orPoolActive = true;
          orPoolMatch = orPoolMatch || matches;
        }
      }
      const chipsOk = andOk && (!orPoolActive || orPoolMatch);

      const yearOk = album.year >= yearRange[0] && album.year <= yearRange[1];
      const runtimeSeconds = parseRuntimeSeconds(album.runtime);
      const runtimeOk = runtimeSeconds >= runtimeRange[0] && runtimeSeconds <= runtimeRange[1];
      return chipsOk && yearOk && runtimeOk;
    });
  }, [rankedAlbums, genreValues, labelValues, chipMode, yearRange, runtimeRange]);

  return (
    <div className="w-full px-1">
      <div className="flex items-center w-full">
        <div className="flex flex-1 min-w-0 flex-col p-2 text-xl font-semibold tracking-widest text-foreground">
          <span>{title}</span>
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

        {filteredAlbums.map(({ album, rank }) => (
          <AlbumCard
            key={album.id}
            rank={rank}
            album={album}
            userAlbum={userAlbums.find((ua) => ua.albumId === album.id)}
          />
        ))}
      </div>
    </div>
  );
}
