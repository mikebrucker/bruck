"use client";

import {
  Album01Icon,
  GridViewIcon,
  ListViewIcon,
  RankingIcon,
  UserGroup03Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useMusicFilterStore } from "@/stores/useMusicFilterStore";
import {
  type AlbumView,
  AlbumViews,
  type MusicList,
  MusicLists,
  type View,
  Views,
} from "@/types/settings";

type MusicViewToggleProps = {
  scrolled: boolean;
};

function isView(value: string): value is View {
  return value in Views;
}

function isMusicList(value: string): value is MusicList {
  return value in MusicLists;
}

function isAlbumView(value: string): value is AlbumView {
  return value in AlbumViews;
}

export function MusicViewToggle({ scrolled }: MusicViewToggleProps) {
  const { t } = useTranslation();
  const view = useMusicFilterStore((s) => s.view);
  const setView = useMusicFilterStore((s) => s.setView);
  const musicList = useMusicFilterStore((s) => s.musicList);
  const setMusicList = useMusicFilterStore((s) => s.setMusicList);
  const albumView = useMusicFilterStore((s) => s.albumView);
  const setAlbumView = useMusicFilterStore((s) => s.setAlbumView);

  return (
    <Popover
      useCloseButton
      className="max-h-[70dvh] overflow-y-auto flex flex-col gap-3 p-3 pb-4 translate-x-16 sm:translate-x-18"
      title={t(($) => $.music.filter.view)}
      trigger={
        <Button
          size={scrolled ? "icon" : "icon-lg"}
          variant="outline"
          aria-label={t(($) => $.music.filter.title)}
          className={cn(
            "hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 ease-out cursor-pointer",
          )}
        >
          <HugeiconsIcon
            icon={GridViewIcon}
            className={cn(scrolled ? "size-5" : "size-6", "transition-all duration-500 ease-out")}
            aria-hidden="true"
          />
        </Button>
      }
    >
      <div className="flex justify-center px-2">
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          className="bg-background"
          value={view}
          onValueChange={(next) => {
            if (isView(next)) setView(next);
          }}
        >
          <ToggleGroupItem
            value={Views.list}
            icon={ListViewIcon}
            iconClassName="size-5"
            className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.music.filter.view_list)}
          >
            {t(($) => $.music.filter.view_list)}
          </ToggleGroupItem>
          <ToggleGroupItem
            value={Views.grid}
            icon={GridViewIcon}
            iconClassName="size-5"
            className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.music.filter.view_grid)}
          >
            {t(($) => $.music.filter.view_grid)}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex justify-center px-2">
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          className="bg-background"
          value={musicList}
          onValueChange={(next) => {
            if (isMusicList(next)) setMusicList(next);
          }}
        >
          <ToggleGroupItem
            value={MusicLists.albums}
            icon={Vynil02Icon}
            iconClassName="size-5"
            className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.music.filter.show_albums)}
          >
            {t(($) => $.music.filter.show_albums)}
          </ToggleGroupItem>
          <ToggleGroupItem
            value={MusicLists.artists}
            icon={UserGroup03Icon}
            iconClassName="size-5"
            className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.music.filter.show_artists)}
          >
            {t(($) => $.music.filter.show_artists)}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {musicList === MusicLists.albums ? (
        <div className="flex justify-center px-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            className="bg-background"
            value={albumView}
            onValueChange={(next) => {
              if (isAlbumView(next)) setAlbumView(next);
            }}
          >
            <ToggleGroupItem
              value={AlbumViews.ranked}
              icon={RankingIcon}
              iconClassName="size-5"
              className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
              aria-label={t(($) => $.music.filter.albums_ranked)}
            >
              {t(($) => $.music.filter.albums_ranked)}
            </ToggleGroupItem>
            <ToggleGroupItem
              value={AlbumViews.all}
              icon={Album01Icon}
              iconClassName="size-5"
              className="flex-1 basis-0 min-w-0 data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
              aria-label={t(($) => $.music.filter.albums_all)}
            >
              {t(($) => $.music.filter.albums_all)}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      ) : null}
    </Popover>
  );
}
