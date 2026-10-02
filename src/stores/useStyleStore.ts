import { clampZoom, darkSchemeQuery, Zooms } from "@/lib/settings";
import { roundedCornerVars } from "@/lib/styles";
import { createHmrStore } from "@/stores/createHmrStore";
import {
  type Accent,
  Accents,
  type ResolvedTheme,
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
  /** What `theme` renders as, with `Themes.system` swapped for the OS color scheme. */
  resolvedTheme: ResolvedTheme;
  accent: Accent;
  roundedPrimary: RoundedCorner;
  roundedSecondary: RoundedCorner;
  menuSide: Side;
  zoom: number;
  highContrast: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
  setRoundedPrimary: (roundedPrimary: RoundedCorner) => void;
  setRoundedSecondary: (roundedSecondary: RoundedCorner) => void;
  setMenuSide: (menuSide: Side) => void;
  setZoom: (zoom: number) => void;
  setHighContrast: (highContrast: boolean) => void;
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme !== Themes.system) return theme;
  return window.matchMedia(darkSchemeQuery).matches ? Themes.dark : Themes.light;
};

const applyTheme = (theme: Theme, resolvedTheme: ResolvedTheme) => {
  document.documentElement.classList.toggle("dark", resolvedTheme === Themes.dark);
  document.documentElement.classList.toggle("light", resolvedTheme === Themes.light);
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

const applyZoom = (zoom: number) => {
  document.documentElement.style.setProperty("--zoom", `${zoom}px`);
  localStorage.setItem("zoom", String(zoom));
};

const applyHighContrast = (highContrast: boolean) => {
  document.documentElement.classList.toggle("high-contrast", highContrast);
  localStorage.setItem("high-contrast", String(highContrast));
};

const applyMenuSide = (menuSide: Side) => {
  localStorage.setItem("menu-side", menuSide);
};

export const useStyleStore = createHmrStore<StyleState>(
  "style",
  [
    "theme",
    "resolvedTheme",
    "accent",
    "roundedPrimary",
    "roundedSecondary",
    "menuSide",
    "zoom",
    "ready",
    "highContrast",
  ],
  (set, get) => ({
    theme: Themes.system,
    resolvedTheme: Themes.light,
    accent: Accents.emerald,
    roundedPrimary: RoundedCorners.lg,
    roundedSecondary: RoundedCorners.md,
    menuSide: Sides.right,
    zoom: Zooms.default,
    ready: false,
    highContrast: false,
    setTheme: (theme) => {
      const resolvedTheme = resolveTheme(theme);
      applyTheme(theme, resolvedTheme);
      set({ theme, resolvedTheme });
    },
    toggleTheme: () => {
      get().setTheme(get().resolvedTheme === Themes.dark ? Themes.light : Themes.dark);
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
    setZoom: (zoom) => {
      const next = clampZoom(zoom);
      applyZoom(next);
      set({ zoom: next });
    },
    setHighContrast: (highContrast) => {
      applyHighContrast(highContrast);
      set({ highContrast });
    },
  }),
);
