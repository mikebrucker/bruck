"use client";

import {
  AudioBook02Icon,
  Castle02Icon,
  Close,
  CodesandboxIcon,
  FileBadgeIcon,
  HtmlFile02Icon,
  LaptopProgrammingIcon,
  Moon02Icon,
  Pdf02Icon,
  Playlist01Icon,
  Settings01Icon,
  Sun02Icon,
  UserGroup03Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { flagMap, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useStyleStore } from "@/stores/useStyleStore";
import { Themes } from "@/types/settings";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  useTheme?: boolean;
  side?: "left" | "right";
}

function Menu({ open, onClose, useTheme, side = "right" }: MenuProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();
  const { token } = useAdminAuthStore();
  const isAdmin = Boolean(token);
  const changeLanguageUrl = useChangeLanguageUrl();
  const isAlbumsSelected = pathname.startsWith(`/${language}/music`);
  const isPlaygroundSelected = pathname.startsWith(`/${language}/playground`);
  const isAboutSelected = pathname.startsWith(`/${language}/about`);
  const isCvSelected = pathname.startsWith(`/${language}/cv`);
  const isAdminSelected = pathname.startsWith(`/${language}/admin`);
  const isSettingsSelected = pathname.startsWith(`/${language}/settings`);
  const selectedClassName = "bg-theme-400 border-theme-300";
  const { theme, toggleTheme } = useStyleStore();

  return (
    <Drawer
      classNames={cn(
        "flex flex-col rounded-l-primary",
        side === "right"
          ? "border-l-4 border-l-theme-500 border-r-2"
          : "border-r-4 border-r-theme-500 border-l-2",
      )}
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
          <HugeiconsIcon icon={Close} className="size-6 text-theme-500" />
        </Button>
      </div>
      <nav className="flex flex-col px-2.5 sm:px-3 gap-0.5">
        <Button
          asChild
          variant="keyboard"
          className={cn("justify-start h-13", isAlbumsSelected ? selectedClassName : null)}
          onClick={onClose}
        >
          <Link href={`/${language}/music/`}>
            <HugeiconsIcon
              icon={Vynil02Icon}
              className={cn("size-6", isAlbumsSelected ? null : "text-theme-500")}
            />
            <span>{t(($) => $.menu.music)}</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className={cn("justify-start h-13", isPlaygroundSelected ? selectedClassName : null)}
          onClick={onClose}
        >
          <Link href={`/${language}/playground/`}>
            <HugeiconsIcon
              icon={CodesandboxIcon}
              className={cn("size-6", isPlaygroundSelected ? null : "text-theme-500")}
            />
            <span>{t(($) => $.menu.playground)}</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className={cn("justify-start h-13", isAboutSelected ? selectedClassName : null)}
          onClick={onClose}
        >
          <Link href={`/${language}/about/`}>
            <HugeiconsIcon
              icon={LaptopProgrammingIcon}
              className={cn("size-6", isAboutSelected ? null : "text-theme-500")}
            />
            <span>{t(($) => $.menu.about)}</span>
          </Link>
        </Button>
        <div className="mt-auto gap-0.5 flex">
          <Button
            asChild
            variant="keyboard"
            className={cn("justify-start h-13 grow", isCvSelected ? selectedClassName : null)}
            onClick={onClose}
          >
            <Link href={`/${language}/cv/`}>
              <HugeiconsIcon
                icon={FileBadgeIcon}
                className={cn("size-6", isCvSelected ? null : "text-theme-500")}
              />
              <span>
                {t(($) => $.menu.cv)}/{t(($) => $.menu.resume)}
              </span>
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
              <HugeiconsIcon icon={HtmlFile02Icon} className="size-6 text-theme-500" />
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
              <HugeiconsIcon icon={Pdf02Icon} className="size-6 text-theme-500" />
            </Link>
          </Button>
        </div>
        {isAdmin ? (
          <div className="flex flex-col gap-0.5 pt-8">
            <h2 className="font-metal-mania text-lg font-bold leading-tight px-5 pb-2 flex items-center gap-2">
              <HugeiconsIcon icon={Castle02Icon} className="size-6 shrink-0" />
              {t(($) => $.menu.admin)}
            </h2>
            <div className="mt-auto gap-0.5 flex flex-wrap">
              <Button
                asChild
                variant="keyboard"
                className={cn(
                  "justify-start h-13 grow",
                  isAdminSelected ? selectedClassName : null,
                )}
                onClick={onClose}
              >
                <Link href={`/${language}/admin/album`}>
                  <HugeiconsIcon
                    icon={Playlist01Icon}
                    className={cn("size-6", isAdminSelected ? null : "text-theme-500")}
                  />
                  <span>{t(($) => $.menu.album)}</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="keyboard"
                className={cn(
                  "justify-start h-13 grow",
                  isAdminSelected ? selectedClassName : null,
                )}
                onClick={onClose}
              >
                <Link href={`/${language}/admin/artist`}>
                  <HugeiconsIcon
                    icon={UserGroup03Icon}
                    className={cn("size-6", isAdminSelected ? null : "text-theme-500")}
                  />
                  <span>{t(($) => $.menu.artist)}</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="keyboard"
                className={cn(
                  "justify-start h-13 grow",
                  isAdminSelected ? selectedClassName : null,
                )}
                onClick={onClose}
              >
                <Link href={`/${language}/admin/user-album`}>
                  <HugeiconsIcon
                    icon={AudioBook02Icon}
                    className={cn("size-6", isAdminSelected ? null : "text-theme-500")}
                  />
                  <span>{t(($) => $.menu.userAlbum)}</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </nav>
      <div className="mt-auto py-3 px-2.5 sm:px-3 gap-0.5 flex flex-wrap-reverse justify-end">
        <Button
          asChild
          variant="keyboard"
          size="icon"
          className={cn("h-13 w-13", isSettingsSelected ? selectedClassName : null)}
          onClick={onClose}
          aria-label={t(($) => $.ariaLabels.open_settings_page)}
        >
          <Link href={`/${language}/settings`}>
            <HugeiconsIcon
              icon={Settings01Icon}
              className={cn("size-6", isSettingsSelected ? null : "text-theme-500")}
            />
          </Link>
        </Button>
        <Button
          variant="keyboard"
          size="icon"
          onClick={toggleTheme}
          className={cn(
            "h-13 w-13",
            theme === Themes.light
              ? "bg-amber-200 border-yellow-200"
              : "bg-indigo-800 border-indigo-900",
          )}
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
            className={cn("h-13 w-13", locale === language ? selectedClassName : null)}
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
