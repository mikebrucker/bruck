"use client";

import {
  Bone01Icon,
  BrokenBoneIcon,
  FilterHorizontalIcon,
  FilterResetIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Popover } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatRuntimeSeconds } from "@/lib/album";
import {
  albumBounds,
  type ChipField,
  ChipFields,
  type ChipMode,
  ChipModes,
  chipKey,
  fieldMatches,
  matchesRanges,
  selectedValuesForField,
} from "@/lib/albumFilter";
import { distinctSorted } from "@/lib/utils";
import { useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import type { Album } from "@/types/album";

type AlbumFilterProps = {
  albums: Array<Album>;
  filterKey: string;
};

const EMPTY_SET = new Set<string>();

export function AlbumFilter({ albums, filterKey }: AlbumFilterProps) {
  const { t } = useTranslation();

  const selected = useAlbumFilterStore((s) => s.selectedByList[filterKey] ?? EMPTY_SET);
  const toggleFilter = useAlbumFilterStore((s) => s.toggleFilter);
  const storedRankRange = useAlbumFilterStore((s) => s.rankRangeByList[filterKey]);
  const setRankRange = useAlbumFilterStore((s) => s.setRankRange);
  const storedYearRange = useAlbumFilterStore((s) => s.yearRangeByList[filterKey]);
  const setYearRange = useAlbumFilterStore((s) => s.setYearRange);
  const storedRuntimeRange = useAlbumFilterStore((s) => s.runtimeRangeByList[filterKey]);
  const setRuntimeRange = useAlbumFilterStore((s) => s.setRuntimeRange);
  const genreMode =
    useAlbumFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.genre]) ?? ChipModes.or;
  const labelMode =
    useAlbumFilterStore((s) => s.chipModeByList[filterKey]?.[ChipFields.label]) ?? ChipModes.or;
  const toggleChipMode = useAlbumFilterStore((s) => s.toggleChipMode);
  const clearChipField = useAlbumFilterStore((s) => s.clearChipField);

  const bounds = useMemo(() => albumBounds(albums), [albums]);

  const rankRange = storedRankRange ?? bounds.rankRange;
  const yearRange = storedYearRange ?? bounds.yearRange;
  const runtimeRange = storedRuntimeRange ?? bounds.runtimeRange;

  const rangeFilteredAlbums = useMemo(
    () => albums.filter((album) => matchesRanges(album, { rankRange, yearRange, runtimeRange })),
    [albums, rankRange, yearRange, runtimeRange],
  );

  const genreOptions = useMemo(
    () => distinctSorted(albums.flatMap((album) => album.genre)),
    [albums],
  );
  const labelOptions = useMemo(
    () => distinctSorted(albums.flatMap((album) => album.label)),
    [albums],
  );

  const genreValues = useMemo(() => selectedValuesForField(selected, ChipFields.genre), [selected]);
  const labelValues = useMemo(() => selectedValuesForField(selected, ChipFields.label), [selected]);

  const hasActiveFilter =
    selected.size > 0 ||
    rankRange[0] !== bounds.rankRange[0] ||
    rankRange[1] !== bounds.rankRange[1] ||
    yearRange[0] !== bounds.yearRange[0] ||
    yearRange[1] !== bounds.yearRange[1] ||
    runtimeRange[0] !== bounds.runtimeRange[0] ||
    runtimeRange[1] !== bounds.runtimeRange[1];

  /**
   * Chips stay enabled only while they can still yield a result: the other category always
   * constrains the pool (categories are AND), and in AND mode the field constrains itself too,
   * so a chip is offered only when it co-occurs with everything already selected in that field.
   * In OR mode a field must not constrain itself or every unselected chip would go dark.
   */
  const genreInRange = useMemo(() => {
    const pool = rangeFilteredAlbums.filter(
      (album) =>
        fieldMatches(labelValues, labelMode, album.label) &&
        (genreMode === ChipModes.or || fieldMatches(genreValues, genreMode, album.genre)),
    );
    return new Set(pool.flatMap((album) => album.genre));
  }, [rangeFilteredAlbums, labelValues, labelMode, genreValues, genreMode]);

  const labelInRange = useMemo(() => {
    const pool = rangeFilteredAlbums.filter(
      (album) =>
        fieldMatches(genreValues, genreMode, album.genre) &&
        (labelMode === ChipModes.or || fieldMatches(labelValues, labelMode, album.label)),
    );
    return new Set(pool.flatMap((album) => album.label));
  }, [rangeFilteredAlbums, genreValues, genreMode, labelValues, labelMode]);

  useEffect(() => {
    for (const value of genreValues) {
      if (!genreInRange.has(value)) toggleFilter(filterKey, chipKey(ChipFields.genre, value));
    }
    for (const value of labelValues) {
      if (!labelInRange.has(value)) toggleFilter(filterKey, chipKey(ChipFields.label, value));
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
    mode: ChipMode,
    selectedValues: Array<string>,
  ) => {
    const modeText =
      mode === ChipModes.and
        ? t(($) => $.albums.filter_mode_and)
        : t(($) => $.albums.filter_mode_or);
    const clearText = t(($) => $.albums.filter_clear);
    return (
      <Accordion
        key={field}
        title={label}
        size="sm"
        defaultOpen={false}
        classNames="bg-card rounded-lg"
        actionButton={
          <>
            {selectedValues.length ? (
              <button
                type="button"
                disabled={selectedValues.length === 0}
                aria-label={`${label}: ${clearText}`}
                title={clearText}
                onClick={() => clearChipField(filterKey, field)}
                className="border border-border p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                <HugeiconsIcon
                  icon={FilterResetIcon}
                  className="size-5 text-orange-600"
                  aria-hidden="true"
                />
              </button>
            ) : null}
            <button
              type="button"
              aria-label={`${label}: ${modeText}`}
              title={modeText}
              onClick={() => toggleChipMode(filterKey, field)}
              className={`border border-border ${mode === ChipModes.and ? "border-theme-500" : ""} p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer`}
            >
              <HugeiconsIcon
                icon={mode === ChipModes.and ? Bone01Icon : BrokenBoneIcon}
                className={`size-5 ${mode === ChipModes.and ? "text-theme-500" : ""}`}
                aria-hidden="true"
              />
            </button>
          </>
        }
      >
        <div className="flex flex-wrap gap-1.5 px-2">
          {options.length === 0 ? (
            <Chip text={noOptionsText(field)} className="opacity-50 pointer-events-none" />
          ) : (
            options.map((value) => {
              const key = chipKey(field, value);
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
  };

  return (
    <Popover
      useCloseButton
      className="w-[90vw] max-w-120 max-h-[70dvh] overflow-y-auto flex flex-col gap-3 p-3 pb-4"
      trigger={
        <Button
          size="icon-lg"
          variant="outline"
          aria-label={t(($) => $.albums.filter_button)}
          className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${hasActiveFilter ? "border-theme-600 text-theme-600 hover:text-theme-600" : ""}`}
        >
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            className={`size-6 ${hasActiveFilter ? "text-theme-600" : ""}`}
            aria-hidden="true"
          />
        </Button>
      }
    >
      {filterRow(
        ChipFields.genre,
        t(($) => $.albums.filter_genre),
        genreOptions,
        genreInRange,
        genreMode,
        genreValues,
      )}
      {filterRow(
        ChipFields.label,
        t(($) => $.albums.filter_label),
        labelOptions,
        labelInRange,
        labelMode,
        labelValues,
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {rankRange[0]}
          </span>
          <span className="text-center text-xs font-medium text-muted-foreground">
            {t(($) => $.albums.filter_rank)}
          </span>
          <span className="text-right text-xs font-medium tabular-nums text-muted-foreground">
            {rankRange[1]}
          </span>
        </div>
        <Slider
          className="w-full"
          min={bounds.rankRange[0]}
          max={bounds.rankRange[1]}
          value={rankRange}
          onValueChange={(range) => {
            if (range.length === 2) setRankRange(filterKey, range);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
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
          min={bounds.yearRange[0]}
          max={bounds.yearRange[1]}
          value={yearRange}
          onValueChange={(range) => {
            if (range.length === 2) setYearRange(filterKey, range);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
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
          min={bounds.runtimeRange[0]}
          max={bounds.runtimeRange[1]}
          value={runtimeRange}
          onValueChange={(range) => {
            if (range.length === 2) setRuntimeRange(filterKey, range);
          }}
        />
      </div>
    </Popover>
  );
}
