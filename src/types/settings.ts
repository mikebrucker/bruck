export const Themes = {
  light: "light",
  dark: "dark",
} as const;
export type Theme = keyof typeof Themes;

export const Accents = {
  red: "red",
  orange: "orange",
  amber: "amber",
  yellow: "yellow",
  lime: "lime",
  green: "green",
  emerald: "emerald",
  teal: "teal",
  cyan: "cyan",
  sky: "sky",
  blue: "blue",
  indigo: "indigo",
  violet: "violet",
  purple: "purple",
  fuchsia: "fuchsia",
  pink: "pink",
  rose: "rose",
  slate: "slate",
  gray: "gray",
  zinc: "zinc",
  neutral: "neutral",
  stone: "stone",
  mauve: "mauve",
  olive: "olive",
  mist: "mist",
  taupe: "taupe",
} as const;
export type Accent = keyof typeof Accents;
export const accents: Array<Accent> = Object.values(Accents);
