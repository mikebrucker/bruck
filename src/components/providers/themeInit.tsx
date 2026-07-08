"use client";

import { useEffect } from "react";
import { type Theme, Themes, useThemeStore } from "@/stores/useThemeStore";

const isTheme = (value: string | null): value is Theme =>
  value === Themes.light || value === Themes.dark;

export function ThemeInit() {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Themes.dark
      : Themes.light;
    setTheme(isTheme(stored) ? stored : preferred);
    useThemeStore.setState({ ready: true });
  }, [setTheme]);

  return null;
}
