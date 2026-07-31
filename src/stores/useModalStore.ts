import { createHmrStore } from "@/stores/createHmrStore";

type ModalState = {
  openCount: number;
  open: () => void;
  close: () => void;
};

/**
 * How many modals are mounted and open. Nothing subscribes to it — it exists so the last modal to
 * close is the one that restores `body.overflow`. `persistKeys` is empty on purpose: a count
 * carried across Fast Refresh would leave scrolling locked with no modal on screen.
 */
export const useModalStore = createHmrStore<ModalState>("modal", [], (set) => ({
  openCount: 0,
  open: () => set((state) => ({ openCount: state.openCount + 1 })),
  close: () => set((state) => ({ openCount: state.openCount - 1 })),
}));
