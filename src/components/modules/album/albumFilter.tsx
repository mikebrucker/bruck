"use client";

import { Bone01Icon, BrokenBoneIcon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import { Popover } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatRuntimeSeconds, parseRuntimeSeconds } from "@/lib/album";
import { type ChipMode, ChipModes, useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import type { Album } from "@/types/album";

type AlbumFilterProps = {
  albums: Array<Album>;
  filterKey: string;
};

const ChipFields = {
  genre: "genre",
  label: "label",
} as const;
type ChipField = keyof typeof ChipFields;

const EMPTY_SET = new Set<string>();

const distinctSorted = (values: Array<string>): Array<string> =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

const selectedValuesForField = (selected: Set<string>, field: ChipField): Array<string> => {
  const prefix = `${field}:`;
  return Array.from(selected)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length));
};

const fieldMatches = (values: Array<string>, mode: ChipMode, albumValue: string): boolean =>
  values.length === 0 ||
  (mode === ChipModes.and ? values.every((v) => v === albumValue) : values.includes(albumValue));

export function AlbumFilter({ albums, filterKey }: AlbumFilterProps) {
  const { t } = useTranslation();

  const selected = useAlbumFilterStore((s) => s.selectedByList[filterKey] ?? EMPTY_SET);
  const toggleFilter = useAlbumFilterStore((s) => s.toggleFilter);
  const storedYearRange = useAlbumFilterStore((s) => s.yearRangeByList[filterKey]);
  const setYearRange = useAlbumFilterStore((s) => s.setYearRange);
  const storedRuntimeRange = useAlbumFilterStore((s) => s.runtimeRangeByList[filterKey]);
  const setRuntimeRange = useAlbumFilterStore((s) => s.setRuntimeRange);
  const chipMode = useAlbumFilterStore((s) => s.chipModeByList[filterKey]) ?? ChipModes.or;
  const toggleChipMode = useAlbumFilterStore((s) => s.toggleChipMode);

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

  const rangeFilteredAlbums = useMemo(
    () =>
      albums.filter((album) => {
        const yearOk = album.year >= yearRange[0] && album.year <= yearRange[1];
        const runtimeSeconds = parseRuntimeSeconds(album.runtime);
        const runtimeOk = runtimeSeconds >= runtimeRange[0] && runtimeSeconds <= runtimeRange[1];
        return yearOk && runtimeOk;
      }),
    [albums, yearRange, runtimeRange],
  );

  const genreOptions = useMemo(() => distinctSorted(albums.map((album) => album.genre)), [albums]);
  const labelOptions = useMemo(() => distinctSorted(albums.map((album) => album.label)), [albums]);

  const genreValues = useMemo(() => selectedValuesForField(selected, ChipFields.genre), [selected]);
  const labelValues = useMemo(() => selectedValuesForField(selected, ChipFields.label), [selected]);

  const genreInRange = useMemo(() => {
    const pool =
      chipMode === ChipModes.and
        ? rangeFilteredAlbums.filter((album) => fieldMatches(labelValues, chipMode, album.label))
        : rangeFilteredAlbums;
    return new Set(pool.map((album) => album.genre));
  }, [rangeFilteredAlbums, labelValues, chipMode]);

  const labelInRange = useMemo(() => {
    const pool =
      chipMode === ChipModes.and
        ? rangeFilteredAlbums.filter((album) => fieldMatches(genreValues, chipMode, album.genre))
        : rangeFilteredAlbums;
    return new Set(pool.map((album) => album.label));
  }, [rangeFilteredAlbums, genreValues, chipMode]);

  useEffect(() => {
    for (const value of genreValues) {
      if (!genreInRange.has(value)) toggleFilter(filterKey, `${ChipFields.genre}:${value}`);
    }
    for (const value of labelValues) {
      if (!labelInRange.has(value)) toggleFilter(filterKey, `${ChipFields.label}:${value}`);
    }
  }, [genreValues, labelValues, genreInRange, labelInRange, filterKey, toggleFilter]);

  const noOptionsText = (field: ChipField): string => {
    switch (field) {
      case ChipFields.genre:
        return t(($) => $.albums.filter_no_genres);
      case ChipFields.label:
        return t(($) => $.albums.filter_no_labels);
    }
  };

  const filterRow = (
    field: ChipField,
    label: string,
    options: Array<string>,
    inRangeValues: Set<string>,
  ) => (
    <Accordion
      key={field}
      title={label}
      size="sm"
      defaultOpen={false}
      classNames="bg-card rounded-lg"
      actionButton={
        <button
          type="button"
          aria-label={
            chipMode === ChipModes.and
              ? t(($) => $.albums.filter_mode_and)
              : t(($) => $.albums.filter_mode_or)
          }
          title={
            chipMode === ChipModes.and
              ? t(($) => $.albums.filter_mode_and)
              : t(($) => $.albums.filter_mode_or)
          }
          onClick={() => toggleChipMode(filterKey)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <HugeiconsIcon
            icon={chipMode === ChipModes.and ? Bone01Icon : BrokenBoneIcon}
            className={`size-5 ${chipMode === ChipModes.and ? "text-theme-500" : ""}`}
            aria-hidden="true"
          />
        </button>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {options.length === 0 ? (
          <Chip text={noOptionsText(field)} className="opacity-50 pointer-events-none" />
        ) : (
          options.map((value) => {
            const key = `${field}:${value}`;
            const active = selected.has(key);
            const disabled = !inRangeValues.has(value);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
                onClick={() => toggleFilter(filterKey, key)}
              >
                <Chip
                  text={value}
                  className={
                    disabled
                      ? "opacity-50 pointer-events-none"
                      : active
                        ? "bg-theme-500 text-white"
                        : undefined
                  }
                />
              </button>
            );
          })
        )}
      </div>
    </Accordion>
  );

  return (
    <Popover
      useCloseButton
      className="w-[90vw] max-w-120 max-h-[70vh] overflow-y-auto flex flex-col gap-3 p-3 pb-4"
      trigger={
        <button
          type="button"
          aria-label={t(($) => $.albums.filter_button)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} className="size-6" aria-hidden="true" />
        </button>
      }
    >
      {filterRow(
        ChipFields.genre,
        t(($) => $.albums.filter_genre),
        genreOptions,
        genreInRange,
      )}
      {filterRow(
        ChipFields.label,
        t(($) => $.albums.filter_label),
        labelOptions,
        labelInRange,
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {yearRange[0]}
          </span>
          <span className="text-center text-xs font-medium text-muted-foreground">
            {t(($) => $.albums.filter_year)}
          </span>
          <span className="text-right text-xs font-medium tabular-nums text-muted-foreground">
            {yearRange[1]}
          </span>
        </div>
        <Slider
          className="w-full"
          min={yearBounds[0]}
          max={yearBounds[1]}
          value={yearRange}
          onValueChange={(range) => {
            if (range.length === 2) setYearRange(filterKey, range);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {formatRuntimeSeconds(runtimeRange[0])}
          </span>
          <span className="text-center text-xs font-medium text-muted-foreground">
            {t(($) => $.albums.filter_runtime)}
          </span>
          <span className="text-right text-xs font-medium tabular-nums text-muted-foreground">
            {formatRuntimeSeconds(runtimeRange[1])}
          </span>
        </div>
        <Slider
          className="w-full"
          min={runtimeBounds[0]}
          max={runtimeBounds[1]}
          value={runtimeRange}
          onValueChange={(range) => {
            if (range.length === 2) setRuntimeRange(filterKey, range);
          }}
        />
      </div>
    </Popover>
  );
}
