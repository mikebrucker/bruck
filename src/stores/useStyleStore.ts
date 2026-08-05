import { createHmrStore } from "@/stores/createHmrStore";
import { type Accent, Accents, type Theme, Themes } from "@/types/settings";

type StyleState = {
  ready: boolean;
  theme: Theme;
  accent: Accent;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
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

export const useStyleStore = createHmrStore<StyleState>(
  "style",
  ["theme", "accent", "ready"],
  (set, get) => ({
    theme: Themes.light,
    accent: Accents.emerald,
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
  }),
);
