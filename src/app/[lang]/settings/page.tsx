"use client";

import {
  ColorPickerIcon,
  DeletePutBackIcon,
  Moon02Icon,
  SquareRoundCornerIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { SettingsPickerModal } from "@/components/modules/settings/settingsPickerModal";
import { SettingsRow } from "@/components/modules/settings/settingsRow";
import { SettingsSection } from "@/components/modules/settings/settingsSection";
import { SettingsSwatchButton } from "@/components/modules/settings/settingsSwatchButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { useDisclosure } from "@/hooks/useDisclosure";
import { flagColorMap, flagMap, type Language, locales } from "@/i18n/config";
import { roundedCornerVars } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useStyleStore } from "@/stores/useStyleStore";
import {
  type Accent,
  accents,
  type RoundedCorner,
  RoundedCorners,
  type RoundedTarget,
  RoundedTargets,
  roundedCorners,
  Themes,
} from "@/types/settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    theme,
    accent,
    roundedPrimary,
    roundedSecondary,
    setTheme,
    setAccent,
    setRoundedPrimary,
    setRoundedSecondary,
  } = useStyleStore();
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();
  const accentModal = useDisclosure();
  const languageModal = useDisclosure();
  const roundedPrimaryModal = useDisclosure();
  const roundedSecondaryModal = useDisclosure();

  const selectAccent = (value: Accent) => {
    setAccent(value);
    accentModal.close();
  };

  const selectLanguage = (value: Language) => {
    setLanguage(value);
    changeLanguageUrl(value);
    languageModal.close();
  };

  const roundedSettingsRow = (target: RoundedTarget) => {
    const isPrimary = target === RoundedTargets.primary;
    const value = isPrimary ? roundedPrimary : roundedSecondary;
    const setValue = isPrimary ? setRoundedPrimary : setRoundedSecondary;
    const fallback = isPrimary ? RoundedCorners.lg : RoundedCorners.md;
    const modal = isPrimary ? roundedPrimaryModal : roundedSecondaryModal;
    const previewClassName = isPrimary ? "rounded-tr-primary" : "rounded-tr-secondary";
    const label = isPrimary
      ? t(($) => $.settings.roundedPrimary)
      : t(($) => $.settings.roundedSecondary);
    const resetAriaLabel = isPrimary
      ? t(($) => $.ariaLabels.reset_rounded_primary)
      : t(($) => $.ariaLabels.reset_rounded_secondary);
    const openAriaLabel = isPrimary
      ? t(($) => $.ariaLabels.rounded_primary, { rounded: value.toUpperCase() })
      : t(($) => $.ariaLabels.rounded_secondary, { rounded: value.toUpperCase() });

    const select = (corner: RoundedCorner) => {
      setValue(corner);
      modal.close();
    };

    return (
      <SettingsRow label={label} value={t(($) => $.settings.rounded[value])}>
        <div className="flex items-center gap-2">
          {value !== fallback ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 bg-background"
              aria-label={resetAriaLabel}
              onClick={() => setValue(fallback)}
            >
              <HugeiconsIcon icon={DeletePutBackIcon} className="size-6 text-destructive" />
            </Button>
          ) : null}
          <div
            className={cn(
              "size-10 border-t-2 border-r-2 border-dotted border-foreground",
              previewClassName,
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 bg-background"
            aria-label={openAriaLabel}
            onClick={modal.open}
          >
            <HugeiconsIcon icon={SquareRoundCornerIcon} className="size-6" />
          </Button>
        </div>
        <SettingsPickerModal open={modal.isOpen} onClose={modal.close} gridClassName="grid-cols-3">
          {roundedCorners.map((corner) => {
            const isSelected = corner === value;
            return (
              <SettingsSwatchButton
                key={corner}
                selected={isSelected}
                className={
                  isSelected
                    ? "border-8 [border-style:ridge] border-theme-600 dark:border-theme-300"
                    : undefined
                }
                style={{
                  backgroundColor: "var(--color-theme-500)",
                  borderRadius: roundedCornerVars[corner],
                }}
                onClick={() => select(corner)}
              >
                <span className="font-asimovian xs:text-lg sm:text-xl">
                  {corner === RoundedCorners.none
                    ? t(($) => $.settings.rounded.none)
                    : corner.toUpperCase()}
                </span>
              </SettingsSwatchButton>
            );
          })}
        </SettingsPickerModal>
      </SettingsRow>
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
      <h1 className="font-metal-mania font-semibold tracking-widest text-foreground text-xl sm:text-2xl transition-[font-size] duration-500">
        {t(($) => $.settings.title)}
      </h1>
      <SettingsSection id="settings-style-title" title={t(($) => $.settings.style)}>
        <SettingsRow
          label={t(($) => $.settings.theme)}
          value={theme === Themes.dark ? t(($) => $.settings.dark) : t(($) => $.settings.light)}
        >
          <ToggleGroup
            type="single"
            variant="outline"
            size="icon-lg"
            className="bg-background"
            value={theme}
            onValueChange={(value) => {
              if (value === Themes.light || value === Themes.dark) setTheme(value);
            }}
          >
            <ToggleGroupItem
              value={Themes.light}
              icon={Sun02Icon}
              iconClassName="size-5"
              className="data-[state=on]:bg-amber-200 data-[state=on]:border-amber-400 data-[state=on]:text-foreground"
              aria-label={t(($) => $.settings.light)}
            />
            <ToggleGroupItem
              value={Themes.dark}
              icon={Moon02Icon}
              iconClassName="size-5"
              className="data-[state=on]:bg-indigo-800 data-[state=on]:border-indigo-600 data-[state=on]:text-foreground"
              aria-label={t(($) => $.settings.dark)}
            />
          </ToggleGroup>
        </SettingsRow>
        <Separator />
        <SettingsRow label={t(($) => $.settings.accent)} value={t(($) => $.settings[accent])}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 border bg-theme-500 hover:bg-theme-600 dark:hover:bg-theme-400 border-theme-700"
            aria-label={t(($) => $.ariaLabels.accent, { accent: t(($) => $.settings[accent]) })}
            onClick={accentModal.open}
          >
            <HugeiconsIcon icon={ColorPickerIcon} className="size-6" />
          </Button>
          <SettingsPickerModal
            open={accentModal.isOpen}
            onClose={accentModal.close}
            gridClassName="grid-cols-3 xs:grid-cols-4 sm:grid-cols-6"
          >
            {accents.map((a) => {
              const isSelected = a === accent;
              const ridgeShade = theme === Themes.dark ? 300 : 600;
              return (
                <SettingsSwatchButton
                  key={a}
                  selected={isSelected}
                  style={{
                    backgroundColor: `var(--color-${a}-500)`,
                    border: isSelected ? `8px ridge var(--color-${a}-${ridgeShade})` : undefined,
                  }}
                  className="rounded-secondary"
                  onClick={() => selectAccent(a)}
                >
                  <span className="font-asimovian xs:text-lg sm:text-xl">
                    {t(($) => $.settings[a])}
                  </span>
                </SettingsSwatchButton>
              );
            })}
          </SettingsPickerModal>
        </SettingsRow>
        <Separator />
        {roundedSettingsRow(RoundedTargets.primary)}
        <Separator />
        {roundedSettingsRow(RoundedTargets.secondary)}
      </SettingsSection>
      <SettingsSection id="settings-language-title" title={t(($) => $.settings.language)}>
        <SettingsRow label={t(($) => $.settings.language)} value={t(($) => $.language[language])}>
          <Button
            type="button"
            size="icon"
            className="size-10"
            style={{
              backgroundColor: flagColorMap[language].bg,
              borderBlock: `1px solid ${flagColorMap[language].block}`,
              borderInline: `1px solid ${flagColorMap[language].inline}`,
            }}
            aria-label={t(($) => $.ariaLabels.language, {
              language: t(($) => $.language[language]),
            })}
            onClick={languageModal.open}
          >
            <span className={`fi fi-${flagMap[language]} text-xl`} />
          </Button>
          <SettingsPickerModal
            open={languageModal.isOpen}
            onClose={languageModal.close}
            gridClassName="grid-cols-2"
          >
            {locales.map((locale) => {
              const isSelected = locale === language;
              return (
                <SettingsSwatchButton
                  key={locale}
                  selected={isSelected}
                  style={{
                    backgroundColor: flagColorMap[locale].bg,
                    borderBlock: isSelected ? `8px ridge ${flagColorMap[locale].block}` : undefined,
                    borderInline: isSelected
                      ? `8px ridge ${flagColorMap[locale].inline}`
                      : undefined,
                  }}
                  className="flex flex-col gap-1 text-zinc-900 rounded-secondary"
                  onClick={() => selectLanguage(locale)}
                >
                  <span
                    className={`fi fi-${flagMap[locale]} text-4xl xs:text-7xl sm:text-9xl transition-[font-size]`}
                  />
                  <span className="font-asimovian text-lg xs:text-xl sm:text-2xl transition-[font-size]">
                    {t(($) => $.language[locale])}
                  </span>
                </SettingsSwatchButton>
              );
            })}
          </SettingsPickerModal>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
