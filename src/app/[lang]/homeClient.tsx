"use client";

import {
  CodesandboxIcon,
  FileBadgeIcon,
  LaptopProgrammingIcon,
  Settings01Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { AlbumMarquee } from "@/components/modules/home/albumMarquee";
import { HomeCard, type HomeCardProps } from "@/components/modules/home/homeCard";
import type en from "@/i18n/locales/en.json";
import { useLanguageStore } from "@/stores/useLanguageStore";

type CardKey = keyof typeof en.home.cards;
type DashboardCard = {
  key: CardKey;
  path: string;
  icon: IconSvgElement;
  size: HomeCardProps["size"];
  className?: string;
};

type HomeClientProps = {
  albumArt: Array<string>;
};

const cards: Array<DashboardCard> = [
  {
    key: "music",
    path: "music",
    icon: Vynil02Icon,
    size: "hero",
    className: "sm:col-span-2 md:row-span-2",
  },
  {
    key: "playground",
    path: "playground",
    icon: CodesandboxIcon,
    size: "default",
    className: "sm:col-span-2",
  },
  { key: "about", path: "about", icon: LaptopProgrammingIcon, size: "compact" },
  { key: "cv", path: "cv", icon: FileBadgeIcon, size: "compact" },
];

const settingsCard: DashboardCard = {
  key: "settings",
  path: "settings",
  icon: Settings01Icon,
  size: "compact",
  className: "w-fit",
};

function HomeClient({ albumArt }: HomeClientProps) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  const renderCard = (card: DashboardCard) => (
    <HomeCard
      key={card.key}
      href={`/${language}/${card.path}`}
      title={t(($) => $.home.cards[card.key].title)}
      description={
        card.key === "settings" ? undefined : t(($) => $.home.cards[card.key].description)
      }
      icon={card.icon}
      size={card.size}
      className={card.className}
      media={card.key === "music" ? <AlbumMarquee art={albumArt} className="mt-auto pt-1" /> : null}
    />
  );

  return (
    <div className="w-full flex flex-col grow gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(renderCard)}
      </div>
      <div className="flex justify-end">{renderCard(settingsCard)}</div>
    </div>
  );
}

export { HomeClient };
