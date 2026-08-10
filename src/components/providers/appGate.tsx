"use client";

import Loader from "@/components/ui/loader";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useStyleStore } from "@/stores/useStyleStore";

export function AppGate({ children }: { children: React.ReactNode }) {
  const themeReady = useStyleStore((s) => s.ready);
  const languageReady = useLanguageStore((s) => s.ready);
  const ready = themeReady && languageReady;

  return (
    <>
      <Loader className="text-theme-500" isOpen={!ready} fullScreen />
      {ready ? children : null}
    </>
  );
}
