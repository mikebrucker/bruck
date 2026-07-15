import { createHmrStore } from "@/stores/createHmrStore";

export const ChipModes = {
  or: "or",
  and: "and",
} as const;
export type ChipMode = keyof typeof ChipModes;

type AlbumFilterState = {
  selectedByList: Record<string, Set<string>>;
  rankRangeByList: Record<string, [number, number]>;
  yearRangeByList: Record<string, [number, number]>;
  runtimeRangeByList: Record<string, [number, number]>;
  chipModeByList: Record<string, ChipMode>;
  toggleFilter: (listKey: string, filterKey: string) => void;
  setRankRange: (listKey: string, range: [number, number]) => void;
  setYearRange: (listKey: string, range: [number, number]) => void;
  setRuntimeRange: (listKey: string, range: [number, number]) => void;
  toggleChipMode: (listKey: string) => void;
};

export const useAlbumFilterStore = createHmrStore<AlbumFilterState>(
  "albumFilter",
  ["selectedByList", "rankRangeByList", "yearRangeByList", "runtimeRangeByList", "chipModeByList"],
  (set, get) => ({
    selectedByList: {},
    rankRangeByList: {},
    yearRangeByList: {},
    runtimeRangeByList: {},
    chipModeByList: {},
    toggleFilter: (listKey, filterKey) => {
      const current = get().selectedByList[listKey] ?? new Set<string>();
      const next = new Set(current);
      if (next.has(filterKey)) {
        next.delete(filterKey);
      } else {
        next.add(filterKey);
      }
      set({ selectedByList: { ...get().selectedByList, [listKey]: next } });
    },
    setRankRange: (listKey, range) => {
      set({ rankRangeByList: { ...get().rankRangeByList, [listKey]: range } });
    },
    setYearRange: (listKey, range) => {
      set({ yearRangeByList: { ...get().yearRangeByList, [listKey]: range } });
    },
    setRuntimeRange: (listKey, range) => {
      set({ runtimeRangeByList: { ...get().runtimeRangeByList, [listKey]: range } });
    },
    toggleChipMode: (listKey) => {
      const nextMode: ChipMode =
        (get().chipModeByList[listKey] ?? ChipModes.or) === ChipModes.or
          ? ChipModes.and
          : ChipModes.or;
      set({ chipModeByList: { ...get().chipModeByList, [listKey]: nextMode } });
    },
  }),
);
