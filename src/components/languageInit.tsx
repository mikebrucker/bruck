"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLocale, type Language } from "@/i18n/config";
import { useLanguageStore } from "@/stores/useLanguageStore";

export function LanguageInit() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();
  const pathnameLanguage = pathname.split("/").filter(Boolean)[0];

  useEffect(() => {
    if (isLocale(pathnameLanguage) && pathnameLanguage !== language) {
      setLanguage(pathnameLanguage as Language);
    }
  }, [language, pathnameLanguage, setLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
