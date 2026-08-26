"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCardModal from "@/components/modules/album/albumCardModal";
import { Chip } from "@/components/ui/chip";
import type { Album } from "@/types/album";

type AlbumGridItemProps = {
  album: Album;
};

export default function AlbumGridItem({ album }: AlbumGridItemProps) {
  const { t } = useTranslation();

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const openAlbum = () => setSelectedAlbum(album);
  const closeAlbum = () => setSelectedAlbum(null);

  const cover = album.art?.[0];

  return (
    <>
      <button
        type="button"
        onClick={openAlbum}
        aria-label={album.album}
        className="relative w-full aspect-square cursor-pointer text-left"
      >
        {cover ? (
          <Image
            src={`/albums/${cover}`}
            alt={t(($) => $.albums.cover_art, { album: album.album })}
            width={320}
            height={320}
            className="w-full h-full rounded-secondary object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-secondary bg-card" />
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
          <Chip
            text={album.artist.artist}
            className="max-w-full bg-background/70 backdrop-blur-sm text-xs"
          />
        </div>
      </button>

      <AlbumCardModal album={selectedAlbum} onClose={closeAlbum} />
    </>
  );
}
