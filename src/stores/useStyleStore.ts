import { roundedCornerVars } from "@/lib/styles";
import { createHmrStore } from "@/stores/createHmrStore";
import {
  type Accent,
  Accents,
  type RoundedCorner,
  RoundedCorners,
  type RoundedTarget,
  RoundedTargets,
  type Side,
  Sides,
  type Theme,
  Themes,
} from "@/types/settings";

type StyleState = {
  ready: boolean;
  theme: Theme;
  accent: Accent;
  roundedPrimary: RoundedCorner;
  roundedSecondary: RoundedCorner;
  menuSide: Side;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
  setRoundedPrimary: (roundedPrimary: RoundedCorner) => void;
  setRoundedSecondary: (roundedSecondary: RoundedCorner) => void;
  setMenuSide: (menuSide: Side) => void;
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === Themes.dark);
  document.documentElement.classList.toggle("light", theme === Themes.light);
  localStorage.setItem("theme", theme);
};

const applyAccent = (accent: Accent) => {
  document.documentElement.dataset.accent = accent;
  localStorage.setItem("accent", accent);
};

const applyRounded = (target: RoundedTarget, corner: RoundedCorner) => {
  document.documentElement.style.setProperty(`--rounded-${target}`, roundedCornerVars[corner]);
  localStorage.setItem(`rounded-${target}`, corner);
};

const applyMenuSide = (menuSide: Side) => {
  localStorage.setItem("menu-side", menuSide);
};

export const useStyleStore = createHmrStore<StyleState>(
  "style",
  ["theme", "accent", "roundedPrimary", "roundedSecondary", "menuSide", "ready"],
  (set, get) => ({
    theme: Themes.light,
    accent: Accents.emerald,
    roundedPrimary: RoundedCorners.lg,
    roundedSecondary: RoundedCorners.md,
    menuSide: Sides.right,
    ready: false,
    setTheme: (theme) => {
      applyTheme(theme);
      set({ theme });
    },
    toggleTheme: () => {
      const next = get().theme === Themes.dark ? Themes.light : Themes.dark;
      applyTheme(next);
      set({ theme: next });
    },
    setAccent: (accent) => {
      applyAccent(accent);
      set({ accent });
    },
    setRoundedPrimary: (roundedPrimary) => {
      applyRounded(RoundedTargets.primary, roundedPrimary);
      set({ roundedPrimary });
    },
    setRoundedSecondary: (roundedSecondary) => {
      applyRounded(RoundedTargets.secondary, roundedSecondary);
      set({ roundedSecondary });
    },
    setMenuSide: (menuSide) => {
      applyMenuSide(menuSide);
      set({ menuSide });
    },
  }),
);
