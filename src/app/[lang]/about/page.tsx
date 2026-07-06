"use client";

import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return <>{t(($) => $.home.under_construction)}</>;
}
