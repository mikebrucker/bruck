"use client";

import { useTranslation } from "react-i18next";
import { MusicList } from "@/components/modules/music/musicList";
import type { Album } from "@/types/album";

type MusicClientProps = {
  rankedAlbums: Array<Album>;
};

export function MusicClient({ rankedAlbums }: MusicClientProps) {
  const { t } = useTranslation();

  return (
    <MusicList
      albums={rankedAlbums}
      title={t(($) => $.music.albums.ranked)}
      subtitle={t(($) => $.music.albums.ranked_info)}
      filterKey="ranked"
    />
  );
}
