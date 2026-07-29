"use client";

import { useTranslation } from "react-i18next";
import { AlbumList } from "@/components/modules/album/albumList";
import type { Album } from "@/types/album";

type AlbumsClientProps = {
  rankedAlbums: Array<Album>;
};

export function AlbumsClient({ rankedAlbums }: AlbumsClientProps) {
  const { t } = useTranslation();

  return (
    <AlbumList
      albums={rankedAlbums}
      title={t(($) => $.albums.ranked)}
      subtitle={t(($) => $.albums.ranked_info)}
      filterKey="ranked"
    />
  );
}
