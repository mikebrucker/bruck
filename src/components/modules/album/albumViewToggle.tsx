"use client";

import { GridViewIcon, ListViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import { type View, Views } from "@/types/settings";

type AlbumFilterProps = {
  scrolled: boolean;
};

function isView(value: string): value is View {
  return value in Views;
}

export function AlbumViewToggle({ scrolled }: AlbumFilterProps) {
  const { t } = useTranslation();
  const view = useAlbumFilterStore((s) => s.view);
  const setView = useAlbumFilterStore((s) => s.setView);

  return (
    <Popover
      useCloseButton
      className="max-h-[70dvh] overflow-y-auto flex flex-col gap-3 p-3 pb-4 translate-x-16 sm:translate-x-18"
      title={t(($) => $.albums.view)}
      trigger={
        <Button
          size={scrolled ? "icon" : "icon-lg"}
          variant="outline"
          aria-label={t(($) => $.albums.filter)}
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
            className="data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.albums.view_list)}
          >
            {t(($) => $.albums.view_list)}
          </ToggleGroupItem>
          <ToggleGroupItem
            value={Views.grid}
            icon={GridViewIcon}
            iconClassName="size-5"
            className="data-[state=on]:bg-theme-800 data-[state=on]:border-theme-700"
            aria-label={t(($) => $.albums.view_grid)}
          >
            {t(($) => $.albums.view_grid)}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Popover>
  );
}
