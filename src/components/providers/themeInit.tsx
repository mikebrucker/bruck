"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeInit() {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(stored === "light" || stored === "dark" ? stored : preferred);
  }, [setTheme]);

  return null;
}
