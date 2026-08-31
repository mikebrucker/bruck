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
  eagle: "eagle",
  kelly: "kelly",
  flyer: "flyer",
  phantom: "phantom",
  phillie: "phillie",
  maroon: "maroon",
  sixer: "sixer",
} as const;
export type Accent = keyof typeof Accents;
export const accents: Array<Accent> = Object.values(Accents);

export const RoundedTargets = {
  primary: "primary",
  secondary: "secondary",
} as const;
export type RoundedTarget = keyof typeof RoundedTargets;

export const RoundedCorners = {
  none: "none",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
  "3xl": "3xl",
  "4xl": "4xl",
} as const;
export type RoundedCorner = keyof typeof RoundedCorners;
export const roundedCorners: Array<RoundedCorner> = Object.values(RoundedCorners);

export const Views = {
  list: "list",
  grid: "grid",
} as const;
export type View = keyof typeof Views;
export const views: Array<View> = Object.values(Views);

export const MusicLists = {
  artists: "artists",
  albums: "albums",
} as const;
export type MusicList = keyof typeof MusicLists;
export const musicLists: Array<MusicList> = Object.values(MusicLists);

export const Sides = {
  left: "left",
  right: "right",
} as const;
export type Side = keyof typeof Sides;
export const sides: Array<Side> = Object.values(Sides);
