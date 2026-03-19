import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale } from "@/i18n/config";
import de from "@/i18n/locales/de.json";
import en from "@/i18n/locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: de,
    },
    en: {
      translation: en,
    },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
