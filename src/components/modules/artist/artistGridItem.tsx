"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ArtistCardModal from "@/components/modules/artist/artistCardModal";
import { Chip } from "@/components/ui/chip";
import { useStyleStore } from "@/stores/useStyleStore";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";
import { Themes } from "@/types/settings";

type ArtistGridItemProps = {
  artist: Artist;
  albums?: Array<Album>;
  rank?: number;
};

export default function ArtistGridItem({ artist, albums, rank }: ArtistGridItemProps) {
  const { t } = useTranslation();
  const theme = useStyleStore((s) => s.theme);

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const openArtist = () => setSelectedArtist(artist);
  const closeArtist = () => setSelectedArtist(null);

  const [missing, setMissing] = useState<Array<string>>([]);

  const darkLogo = `/artists/${artist.id}-logo.webp`;
  const lightLogo = `/artists/${artist.id}-logo-light.webp`;
  const preferredLogo = theme === Themes.light ? lightLogo : darkLogo;
  const logo = [preferredLogo, darkLogo].find((src) => !missing.includes(src));

  return (
    <>
      <button
        type="button"
        onClick={openArtist}
        aria-label={t(($) => $.music.artists.open_artist, { artist: artist.artist })}
        className="relative w-full aspect-square cursor-pointer text-left bg-card rounded-secondary"
      >
        {logo ? (
          <Image
            key={logo}
            src={logo}
            alt={t(($) => $.music.artists.logo, { artist: artist.artist })}
            width={320}
            height={320}
            sizes="(min-width: 640px) 320px, 50vw"
            onError={() => setMissing((prev) => [...prev, logo])}
            className="w-full h-full rounded-secondary object-contain p-3"
          />
        ) : null}
        {rank ? (
          <Chip
            text={String(rank)}
            className="font-mono absolute top-1 left-1 aspect-square min-w-8 sm:min-w-11 justify-center bg-background/70 backdrop-blur-sm text-lg sm:text-2xl font-bold text-theme-600 tabular-nums"
          />
        ) : null}
        <div className="absolute bottom-1 left-1 right-1 flex flex-col items-start gap-1">
          <Chip
            text={artist.artist}
            className="max-w-full bg-background/70 backdrop-blur-sm font-bold"
          />
        </div>
      </button>

      <ArtistCardModal artist={selectedArtist} albums={albums} onClose={closeArtist} />
    </>
  );
}
