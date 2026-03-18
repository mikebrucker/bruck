import { create } from "zustand";
import { defaultLocale, isLocale, type Language } from "@/i18n/config";

type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const setLang = (setLang?: string): Language => {
  if (!setLang && typeof window === "undefined") return defaultLocale;
  const lang =
    setLang || navigator.language || navigator.languages?.[0] || defaultLocale;
  const language = lang.split("-")[0];
  return isLocale(language) ? (language as Language) : defaultLocale;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: setLang(),
  setLanguage: (lang) => set({ language: setLang(lang) }),
}));
