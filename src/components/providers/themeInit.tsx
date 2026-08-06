"use client";

import { useEffect } from "react";
import { useStyleStore } from "@/stores/useStyleStore";
import {
  type Accent,
  Accents,
  accents,
  type RoundedCorner,
  RoundedCorners,
  roundedCorners,
  type Theme,
  Themes,
} from "@/types/settings";

const isTheme = (value: string | null): value is Theme =>
  value === Themes.light || value === Themes.dark;

const isAccent = (value: string | null): value is Accent =>
  accents.some((accent) => accent === value);

const isRoundedCorner = (value: string | null): value is RoundedCorner =>
  roundedCorners.some((corner) => corner === value);

export function ThemeInit() {
  const setTheme = useStyleStore((s) => s.setTheme);
  const setAccent = useStyleStore((s) => s.setAccent);
  const setRoundedPrimary = useStyleStore((s) => s.setRoundedPrimary);
  const setRoundedSecondary = useStyleStore((s) => s.setRoundedSecondary);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Themes.dark
      : Themes.light;
    setTheme(isTheme(stored) ? stored : preferred);

    const storedAccent = localStorage.getItem("accent");
    setAccent(isAccent(storedAccent) ? storedAccent : Accents.emerald);

    const storedPrimary = localStorage.getItem("rounded-primary");
    setRoundedPrimary(isRoundedCorner(storedPrimary) ? storedPrimary : RoundedCorners.lg);

    const storedSecondary = localStorage.getItem("rounded-secondary");
    setRoundedSecondary(isRoundedCorner(storedSecondary) ? storedSecondary : RoundedCorners.md);

    useStyleStore.setState({ ready: true });
  }, [setTheme, setAccent, setRoundedPrimary, setRoundedSecondary]);

  return null;
}
