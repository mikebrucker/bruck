import { createHmrStore } from "@/stores/createHmrStore";

export const Themes = {
  light: "light",
  dark: "dark",
} as const;
export type Theme = keyof typeof Themes;

type ThemeState = {
  theme: Theme;
  ready: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === Themes.dark);
  document.documentElement.classList.toggle("light", theme === Themes.light);
  localStorage.setItem("theme", theme);
};

export const useThemeStore = createHmrStore<ThemeState>("theme", ["theme", "ready"], (set, get) => ({
  theme: Themes.light,
  ready: false,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggle: () => {
    const next = get().theme === Themes.dark ? Themes.light : Themes.dark;
    applyTheme(next);
    set({ theme: next });
  },
}));
