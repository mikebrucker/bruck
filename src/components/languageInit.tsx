"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export function LanguageInit() {
  const { language } = useLanguageStore();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
