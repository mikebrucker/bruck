import { createHmrStore } from "@/stores/createHmrStore";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  ready: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
};

export const useThemeStore = createHmrStore<ThemeState>("theme", ["theme", "ready"], (set, get) => ({
  theme: "light",
  ready: false,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },
}));
