import { parseRuntimeSeconds } from "@/lib/album";
import type { Album } from "@/types/album";

export const ChipModes = {
  or: "or",
  and: "and",
} as const;
export type ChipMode = keyof typeof ChipModes;

export const ChipFields = {
  genre: "genre",
  label: "label",
} as const;
export type ChipField = keyof typeof ChipFields;

export type AlbumRanges = {
  rankRange: [number, number];
  yearRange: [number, number];
  runtimeRange: [number, number];
};

export const chipPrefix = (field: ChipField): string => `${field}:`;

export const chipKey = (field: ChipField, value: string): string => `${chipPrefix(field)}${value}`;

export const selectedValuesForField = (selected: Set<string>, field: ChipField): Array<string> => {
  const prefix = chipPrefix(field);
  return Array.from(selected)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length));
};

/** Values inside one field combine with AND (every) or OR (some); no selection always matches. */
export const fieldMatches = (values: Array<string>, mode: ChipMode, albumValues: Array<string>) =>
  values.length === 0 ||
  (mode === ChipModes.and
    ? values.every((v) => albumValues.includes(v))
    : values.some((v) => albumValues.includes(v)));

/** Slider bounds, and the fallback range while nothing is stored for a list. */
export const albumBounds = (albums: Array<Album>): AlbumRanges => {
  if (albums.length === 0) {
    return { rankRange: [1, 1], yearRange: [0, 0], runtimeRange: [0, 0] };
  }
  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;
  let minRuntime = Number.POSITIVE_INFINITY;
  let maxRuntime = Number.NEGATIVE_INFINITY;
  for (const album of albums) {
    minYear = Math.min(minYear, album.year);
    maxYear = Math.max(maxYear, album.year);
    const seconds = parseRuntimeSeconds(album.runtime);
    minRuntime = Math.min(minRuntime, seconds);
    maxRuntime = Math.max(maxRuntime, seconds);
  }
  return {
    rankRange: [1, albums.length],
    yearRange: [minYear, maxYear],
    runtimeRange: [minRuntime, maxRuntime],
  };
};

/** Rank/year/runtime gate. Albums without a rank ignore the rank range. */
export const matchesRanges = (album: Album, ranges: AlbumRanges): boolean => {
  const rank = album.userAlbum?.rank ?? null;
  const rankOk = rank === null || (rank >= ranges.rankRange[0] && rank <= ranges.rankRange[1]);
  const yearOk = album.year >= ranges.yearRange[0] && album.year <= ranges.yearRange[1];
  const runtimeSeconds = parseRuntimeSeconds(album.runtime);
  const runtimeOk =
    runtimeSeconds >= ranges.runtimeRange[0] && runtimeSeconds <= ranges.runtimeRange[1];
  return rankOk && yearOk && runtimeOk;
};
