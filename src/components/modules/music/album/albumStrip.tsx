"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Chip } from "@/components/ui/chip";
import type { Album } from "@/types/album";

type AlbumStripProps = {
  albums: Array<Album>;
  title: string;
  onSelect: (album: Album) => void;
};

export default function AlbumStrip({ albums, title, onSelect }: AlbumStripProps) {
  const { t } = useTranslation();

  return (
    <div className="pt-1">
      <div className="flex flex-col bg-background p-2 rounded-primary">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
          {title}
        </p>
        <div className="flex gap-2 overflow-x-auto">
          {albums.map((album) => {
            const cover = album.art?.[0];
            return (
              <button
                key={album.id}
                type="button"
                onClick={() => onSelect(album)}
                className="relative w-40 h-40 shrink-0 cursor-pointer text-left"
              >
                {cover ? (
                  <Image
                    src={`/albums/${cover}`}
                    alt={t(($) => $.music.albums.cover_art, { album: album.album })}
                    width={160}
                    height={160}
                    style={{ height: "auto" }}
                    className="w-40 h-40 rounded-secondary object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-secondary bg-card" />
                )}
                <div className="absolute bottom-1 left-1 right-1 flex flex-col items-start gap-1">
                  <Chip
                    text={String(album.year)}
                    className="bg-background/70 backdrop-blur-sm text-xs tabular-nums"
                  />
                  <Chip
                    text={album.album}
                    className="max-w-full bg-background/70 backdrop-blur-sm text-xs"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
