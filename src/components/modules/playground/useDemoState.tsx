"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Seeds editable demo state from a translation and re-seeds it when the language
 * changes. Switching language only rewrites the url, so nothing here remounts and
 * a plain `useState(t(...))` would keep showing the previous language. Tracking the
 * language in state re-seeds during render, so the preview never paints the old one.
 */
export function useDemoState(translated: string): [string, Dispatch<SetStateAction<string>>] {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(translated);
  const [language, setLanguage] = useState(i18n.language);

  if (language !== i18n.language) {
    setLanguage(i18n.language);
    setValue(translated);
  }

  return [value, setValue];
}
