import type { RoundedCorner } from "@/types/settings";

/**
 * Maps a `RoundedCorner` token to the Tailwind radius theme variable it resolves
 * to. `none` has no theme variable: `rounded-none` is a hardcoded zero radius.
 */
export const roundedCornerVars: Record<RoundedCorner, string> = {
  none: "0",
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  "4xl": "var(--radius-4xl)",
};

export const convexButtonGradient8 =
  "bg-[linear-gradient(to_bottom,rgb(0_0_0/0.1)_0px,transparent_8px,transparent_calc(100%_-_8px),rgb(0_0_0/0.1)_100%),linear-gradient(to_right,rgb(0_0_0/0.1)_0px,transparent_8px,transparent_calc(100%_-_8px),rgb(0_0_0/0.1)_100%)] shadow-sm active:shadow-inner dark:bg-[linear-gradient(to_bottom,rgb(192_192_192/0.1)_0px,transparent_8px,transparent_calc(100%_-_8px),rgb(192_192_192/0.1)_100%),linear-gradient(to_right,rgb(192_192_192/0.1)_0px,transparent_8px,transparent_calc(100%_-_8px),rgb(192_192_192/0.1)_100%)]";
export const convexButtonGradient12 =
  "bg-[linear-gradient(to_bottom,rgb(0_0_0/0.1)_0px,transparent_8px,transparent_calc(100%_-_12px),rgb(0_0_0/0.1)_100%),linear-gradient(to_right,rgb(0_0_0/0.1)_0px,transparent_12px,transparent_calc(100%_-_12px),rgb(0_0_0/0.1)_100%)] shadow-sm active:shadow-inner dark:bg-[linear-gradient(to_bottom,rgb(192_192_192/0.1)_0px,transparent_12px,transparent_calc(100%_-_12px),rgb(192_192_192/0.1)_100%),linear-gradient(to_right,rgb(192_192_192/0.1)_0px,transparent_12px,transparent_calc(100%_-_12px),rgb(192_192_192/0.1)_100%)]";
export const convexButtonGradient16 =
  "bg-[linear-gradient(to_bottom,rgb(0_0_0/0.1)_0px,transparent_8px,transparent_calc(100%_-_16px),rgb(0_0_0/0.1)_100%),linear-gradient(to_right,rgb(0_0_0/0.1)_0px,transparent_16px,transparent_calc(100%_-_16px),rgb(0_0_0/0.1)_100%)] shadow-sm active:shadow-inner dark:bg-[linear-gradient(to_bottom,rgb(192_192_192/0.1)_0px,transparent_16px,transparent_calc(100%_-_16px),rgb(192_192_192/0.1)_100%),linear-gradient(to_right,rgb(192_192_192/0.1)_0px,transparent_16px,transparent_calc(100%_-_16px),rgb(192_192_192/0.1)_100%)]";
export const keyboardButton =
  "min-h-[44px] min-w-[44px] rounded-[10px] [border-style:outset] border-[var(--keycap-edge)] [border-width:8px_10px_10px_8px] bg-[var(--keycap-face)] text-xs text-[var(--keycap-text)] shadow-[0_5px_10px_2px_rgba(0,0,0,0.45)] transition-[box-shadow,transform,border-width] duration-100 ease-out active:translate-y-[3px] active:brightness-95 active:[border-style:inset] active:[border-width:8px_8px_5px_8px] active:shadow-[inset_0_2px_5px_0_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.45)]";
