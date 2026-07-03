"use client";

import Loader from "@/components/modules/loader";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";

export function AppGate({ children }: { children: React.ReactNode }) {
  const themeReady = useThemeStore((s) => s.ready);
  const languageReady = useLanguageStore((s) => s.ready);
  const ready = themeReady && languageReady;

  return (
    <>
      <Loader className="text-theme-500" isOpen={!ready} fullScreen />
      {ready ? children : null}
    </>
  );
}
