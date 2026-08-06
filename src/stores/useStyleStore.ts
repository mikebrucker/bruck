import { roundedCornerVars } from "@/lib/styles";
import { createHmrStore } from "@/stores/createHmrStore";
import {
  type Accent,
  Accents,
  type RoundedCorner,
  RoundedCorners,
  type RoundedTarget,
  RoundedTargets,
  type Theme,
  Themes,
} from "@/types/settings";

type StyleState = {
  ready: boolean;
  theme: Theme;
  accent: Accent;
  roundedPrimary: RoundedCorner;
  roundedSecondary: RoundedCorner;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
  setRoundedPrimary: (roundedPrimary: RoundedCorner) => void;
  setRoundedSecondary: (roundedSecondary: RoundedCorner) => void;
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

export const useStyleStore = createHmrStore<StyleState>(
  "style",
  ["theme", "accent", "roundedPrimary", "roundedSecondary", "ready"],
  (set, get) => ({
    theme: Themes.light,
    accent: Accents.emerald,
    roundedPrimary: RoundedCorners.lg,
    roundedSecondary: RoundedCorners.md,
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
  }),
);
