"use client";

import { useEffect } from "react";
import { useStyleStore } from "@/stores/useStyleStore";
import { type Accent, Accents, accents, type Theme, Themes } from "@/types/settings";

const isTheme = (value: string | null): value is Theme =>
  value === Themes.light || value === Themes.dark;

const isAccent = (value: string | null): value is Accent =>
  accents.some((accent) => accent === value);

export function ThemeInit() {
  const setTheme = useStyleStore((s) => s.setTheme);
  const setAccent = useStyleStore((s) => s.setAccent);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Themes.dark
      : Themes.light;
    setTheme(isTheme(stored) ? stored : preferred);

    const storedAccent = localStorage.getItem("accent");
    setAccent(isAccent(storedAccent) ? storedAccent : Accents.emerald);

    useStyleStore.setState({ ready: true });
  }, [setTheme, setAccent]);

  return null;
}
