/** Root font size in px, written to `--zoom` on <html>. Every rem based size scales with it. */
export const Zooms = {
  min: 12,
  max: 20,
  default: 16,
} as const;

export const clampZoom = (value: number) =>
  Math.min(Zooms.max, Math.max(Zooms.min, Math.round(value)));

/** OS color scheme query, followed while the theme is `Themes.system`. */
export const darkSchemeQuery = "(prefers-color-scheme: dark)";
