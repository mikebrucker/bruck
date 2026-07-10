"use client";

import {
  Castle02Icon,
  Close,
  FileBadgeIcon,
  HtmlFile02Icon,
  LaptopProgrammingIcon,
  Moon02Icon,
  Pdf02Icon,
  Sun02Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { type Language, locales } from "@/i18n/config";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Themes, useThemeStore } from "@/stores/useThemeStore";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  useTheme?: boolean;
  side?: "left" | "right";
}

const flagMap: Record<Language, string> = {
  de: "at",
  en: "us",
};

function Menu({ open, onClose, useTheme, side = "right" }: MenuProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();
  const { token } = useAdminAuthStore();
  const isAdmin = Boolean(token);
  const changeLanguageUrl = useChangeLanguageUrl();
  const isAlbumsSelected = pathname.startsWith(`/${language}/albums`);
  const isAboutSelected = pathname.startsWith(`/${language}/about`);
  const isCvSelected = pathname.startsWith(`/${language}/cv`);
  const isAdminSelected = pathname.startsWith(`/${language}/admin`);
  const selectedClassName = "bg-theme-400 border-theme-300";
  const { theme, toggle } = useThemeStore();

  return (
    <Drawer
      classNames={`flex flex-col ${side === "right" ? "border-l border-r-2" : "border-r border-l-2"} rounded-l-lg`}
      open={open}
      onClose={onClose}
      side={side}
      useTheme={useTheme}
    >
      <div className="flex justify-end py-3 px-2.5 sm:px-3">
        <Button
          variant="keyboard"
          size="icon"
          onClick={onClose}
          aria-label={t(($) => $.ariaLabels.close_menu)}
        >
          <HugeiconsIcon icon={Close} className="size-6" />
        </Button>
      </div>
      <nav className="flex flex-col px-2.5 sm:px-3 gap-0.5">
        <Button
          asChild
          variant="keyboard"
          className={`justify-start h-13 ${isAlbumsSelected ? selectedClassName : ""}`}
          onClick={onClose}
          aria-label={t(($) => $.ariaLabels.open_albums_page)}
        >
          <Link href={`/${language}/albums/`}>
            <HugeiconsIcon icon={Vynil02Icon} className="size-6" />
            {t(($) => $.menu.albums)}
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className={`justify-start h-13 ${isAboutSelected ? selectedClassName : ""}`}
          onClick={onClose}
          aria-label={t(($) => $.ariaLabels.open_about_page)}
        >
          <Link href={`/${language}/about/`}>
            <HugeiconsIcon icon={LaptopProgrammingIcon} className="size-6" />
            {t(($) => $.menu.about)}
          </Link>
        </Button>
        <div className="mt-auto gap-0.5 flex">
          <Button
            asChild
            variant="keyboard"
            className={`justify-start h-13 grow ${isCvSelected ? selectedClassName : ""}`}
            onClick={onClose}
            aria-label={t(($) => $.ariaLabels.open_cv_page)}
          >
            <Link href={`/${language}/cv/`}>
              <HugeiconsIcon icon={FileBadgeIcon} className="size-6" />
              {t(($) => $.menu.cv)}/{t(($) => $.menu.resume)}
            </Link>
          </Button>
          <Button
            asChild
            variant="keyboard"
            size="icon"
            className="h-13 w-13"
            onClick={onClose}
            aria-label={t(($) => $.ariaLabels.open_html_cv)}
          >
            <Link href="/mike-brucker-cv.html" target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={HtmlFile02Icon} className="size-6" />
            </Link>
          </Button>
          <Button
            asChild
            variant="keyboard"
            size="icon"
            className="h-13 w-13"
            onClick={onClose}
            aria-label={t(($) => $.ariaLabels.open_pdf_cv)}
          >
            <Link href="/mike-brucker-cv.pdf" target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={Pdf02Icon} className="size-6" />
            </Link>
          </Button>
        </div>
        {isAdmin ? (
          <div className="flex flex-col gap-0.5 pt-8">
            <h2 className="text-lg font-bold leading-tight px-4">{t(($) => $.menu.admin)}</h2>
            <Button
              asChild
              variant="keyboard"
              className={`justify-start h-13 grow ${isAdminSelected ? selectedClassName : ""}`}
              onClick={onClose}
              aria-label={t(($) => $.ariaLabels.open_admin_page)}
            >
              <Link href={`/${language}/admin/`}>
                <HugeiconsIcon icon={Castle02Icon} className="size-6" />
                {t(($) => $.menu.admin)}
              </Link>
            </Button>
          </div>
        ) : null}
      </nav>
      <div className="mt-auto py-3 px-2.5 sm:px-3 gap-0.5 flex flex-wrap-reverse justify-end">
        <Button
          variant="keyboard"
          size="icon"
          onClick={toggle}
          className={`h-13 w-13 ${theme === Themes.light ? "bg-amber-200 border-yellow-200" : "bg-indigo-800 border-indigo-900"}`}
          aria-label={
            theme === Themes.light
              ? t(($) => $.ariaLabels.switch_to_dark_mode)
              : t(($) => $.ariaLabels.switch_to_light_mode)
          }
        >
          <HugeiconsIcon icon={theme === Themes.dark ? Moon02Icon : Sun02Icon} className="size-6" />
        </Button>
        {locales.map((locale) => (
          <Button
            key={locale}
            variant="keyboard"
            size="icon"
            className={`h-13 w-13 ${locale === language ? selectedClassName : ""}`}
            aria-label={t(($) => $.ariaLabels.language, { language: t(($) => $.language[locale]) })}
            onClick={() => {
              setLanguage(locale);
              changeLanguageUrl(locale);
            }}
          >
            <span className={`fi fi-${flagMap[locale]} text-lg`} />
          </Button>
        ))}
      </div>
    </Drawer>
  );
}

export { Menu };
