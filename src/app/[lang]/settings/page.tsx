"use client";

import { ColorPickerIcon, Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "radix-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsRow } from "@/components/modules/settings/settingsRow";
import { SettingsSection } from "@/components/modules/settings/settingsSection";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { flagColorMap, flagMap, type Language, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useStyleStore } from "@/stores/useStyleStore";
import { type Accent, accents, Themes } from "@/types/settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, accent, setTheme, setAccent } = useStyleStore();
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();
  const [accentModalIsOpen, setAccentModalIsOpen] = useState(false);
  const [languageModalIsOpen, setLanguageModalIsOpen] = useState(false);

  const openAccentModal = () => setAccentModalIsOpen(true);
  const closeAccentModal = () => setAccentModalIsOpen(false);
  const openLanguageModal = () => setLanguageModalIsOpen(true);
  const closeLanguageModal = () => setLanguageModalIsOpen(false);

  const selectAccent = (value: Accent) => {
    setAccent(value);
    closeAccentModal();
  };

  const selectLanguage = (value: Language) => {
    setLanguage(value);
    changeLanguageUrl(value);
    closeLanguageModal();
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
        <Separator.Root decorative className="h-px w-full shrink-0 bg-border" />
        <SettingsRow label={t(($) => $.settings.accent)} value={t(($) => $.settings[accent])}>
          <Button
            type="button"
            size="icon"
            className="size-10"
            style={{
              backgroundColor: `var(--color-${accent}-500)`,
              border:
                theme === Themes.light
                  ? `1px solid var(--color-${accent}-700)`
                  : `1px solid var(--color-${accent}-300)`,
            }}
            aria-label={t(($) => $.ariaLabels.accent, { accent: t(($) => $.settings[accent]) })}
            onClick={openAccentModal}
          >
            <HugeiconsIcon icon={ColorPickerIcon} className="size-6" />
          </Button>
          <Modal
            open={accentModalIsOpen}
            onClose={closeAccentModal}
            showClose
            className="max-w-2xl mx-4 max-h-[80dvh] w-full rounded-lg overflow-y-auto"
          >
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                {accents.map((a) => {
                  const isSelected = a === accent;
                  return (
                    <Button
                      key={a}
                      type="button"
                      variant="ghost"
                      aria-pressed={isSelected}
                      style={{
                        backgroundColor: `var(--color-${a}-500)`,
                        border: isSelected
                          ? `8px ridge var(--color-${a}-${theme === Themes.dark ? 300 : 600})`
                          : undefined,
                      }}
                      className="relative isolate w-full h-auto aspect-4/3 rounded-lg after:content-[''] after:absolute after:inset-0 after:-z-10 after:transition-colors hover:after:bg-black/25 overflow-hidden"
                      onClick={() => selectAccent(a)}
                    >
                      <span className="font-asimovian xs:text-lg sm:text-xl">
                        {t(($) => $.settings[a])}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Modal>
        </SettingsRow>
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
            onClick={openLanguageModal}
          >
            <span className={`fi fi-${flagMap[language]} text-xl`} />
          </Button>
          <Modal
            open={languageModalIsOpen}
            onClose={closeLanguageModal}
            showClose
            className="max-w-2xl mx-4 max-h-[80dvh] w-full rounded-lg overflow-y-auto"
          >
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {locales.map((locale) => {
                  const isSelected = locale === language;
                  return (
                    <Button
                      key={locale}
                      type="button"
                      variant="ghost"
                      aria-pressed={isSelected}
                      style={{
                        backgroundColor: flagColorMap[locale].bg,
                        borderBlock: isSelected
                          ? `8px ridge ${flagColorMap[locale].block}`
                          : undefined,
                        borderInline: isSelected
                          ? `8px ridge ${flagColorMap[locale].inline}`
                          : undefined,
                      }}
                      className="relative isolate w-full h-auto aspect-4/3 flex flex-col gap-1 text-zinc-900 rounded-lg after:content-[''] after:absolute after:inset-0 after:-z-10 after:transition-colors hover:after:bg-black/25 overflow-hidden"
                      onClick={() => selectLanguage(locale)}
                    >
                      <span
                        className={`fi fi-${flagMap[locale]} text-4xl xs:text-7xl sm:text-9xl transition-[font-size]`}
                      />
                      <span className="font-asimovian text-lg xs:text-xl sm:text-2xl transition-[font-size]">
                        {t(($) => $.language[locale])}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Modal>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
