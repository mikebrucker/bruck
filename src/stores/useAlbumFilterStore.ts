import { type ChipField, type ChipMode, ChipModes, chipPrefix } from "@/lib/albumFilter";
import { createHmrStore } from "@/stores/createHmrStore";
import { type View, Views } from "@/types/settings";

type AlbumFilterState = {
  selectedByList: Record<string, Set<string>>;
  rankRangeByList: Record<string, [number, number]>;
  yearRangeByList: Record<string, [number, number]>;
  runtimeRangeByList: Record<string, [number, number]>;
  chipModeByList: Record<string, Partial<Record<ChipField, ChipMode>>>;
  view: View;
  toggleFilter: (listKey: string, filterKey: string) => void;
  clearChipField: (listKey: string, field: ChipField) => void;
  setRankRange: (listKey: string, range: [number, number]) => void;
  setYearRange: (listKey: string, range: [number, number]) => void;
  setRuntimeRange: (listKey: string, range: [number, number]) => void;
  toggleChipMode: (listKey: string, field: ChipField) => void;
  setView: (view: View) => void;
};

const applyView = (view: View) => {
  localStorage.setItem("view", view);
};

export const useAlbumFilterStore = createHmrStore<AlbumFilterState>(
  "albumFilter",
  [
    "selectedByList",
    "rankRangeByList",
    "yearRangeByList",
    "runtimeRangeByList",
    "chipModeByList",
    "view",
  ],
  (set, get) => ({
    selectedByList: {},
    rankRangeByList: {},
    yearRangeByList: {},
    runtimeRangeByList: {},
    chipModeByList: {},
    view: Views.list,
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
    clearChipField: (listKey, field) => {
      const current = get().selectedByList[listKey];
      if (!current) return;
      const prefix = chipPrefix(field);
      const next = new Set(Array.from(current).filter((key) => !key.startsWith(prefix)));
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
    toggleChipMode: (listKey, field) => {
      const listModes = get().chipModeByList[listKey] ?? {};
      const nextMode: ChipMode =
        (listModes[field] ?? ChipModes.or) === ChipModes.or ? ChipModes.and : ChipModes.or;
      set({
        chipModeByList: { ...get().chipModeByList, [listKey]: { ...listModes, [field]: nextMode } },
      });
    },
    setView: (view) => {
      applyView(view);
      set({ view });
    },
  }),
);
