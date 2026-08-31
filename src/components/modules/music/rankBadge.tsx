"use client";

import {
  Medal06Icon,
  MedalFirstPlaceIcon,
  MedalSecondPlaceIcon,
  MedalThirdPlaceIcon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/** One row of the list, album or artist, reduced to what the header readout shows. */
export type RankRow = {
  id: string;
  rank?: number;
  title: string;
  subtitle?: string;
};

/** Podium medals for the top three ranks, generic medal for everything below. */
function medalForRank(rank: number) {
  switch (rank) {
    case 1:
      return MedalFirstPlaceIcon;
    case 2:
      return MedalSecondPlaceIcon;
    case 3:
      return MedalThirdPlaceIcon;
    default:
      return Medal06Icon;
  }
}

/**
 * The active row's rank, title and subtitle as one unit, so the slide animation can move all of it
 * together. `null` means no card sits under the header line — an empty list.
 */
export function RankBadge({ row }: { row: RankRow | null }) {
  const rank = row?.rank ?? null;

  return (
    <div className="flex items-center gap-2 min-w-0">
      {rank ? (
        <div className="flex shrink-0 items-center">
          <HugeiconsIcon
            icon={medalForRank(rank)}
            className="w-7 h-7 sm:w-8 sm:h-8 transition-[width,height] duration-500"
          />
          <span className="font-mono font-bold tabular-nums leading-none text-2xl sm:text-3xl transition-[font-size] duration-500">
            {rank}
          </span>
        </div>
      ) : (
        <HugeiconsIcon icon={Vynil02Icon} className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
      )}

      {row ? (
        <div className="flex min-w-0 flex-col">
          <span className="truncate leading-tight font-semibold text-xs sm:text-sm text-foreground transition-[font-size] duration-500">
            {row.title}
          </span>
          {row.subtitle ? (
            <span className="truncate leading-tight normal-case tracking-normal font-normal text-xs sm:text-sm text-muted-foreground transition-[font-size] duration-500">
              {row.subtitle}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
