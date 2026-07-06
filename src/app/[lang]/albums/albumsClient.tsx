"use client";

import { useTranslation } from "react-i18next";
import { AlbumList } from "@/components/modules/albumList";
import type { Album } from "@/types/album";

type AlbumsClientProps = {
  rankedAlbums: Array<Album>;
  honorableMentionAlbums: Array<Album>;
};

export function AlbumsClient({ rankedAlbums, honorableMentionAlbums }: AlbumsClientProps) {
  const { t } = useTranslation();

  return (
    <>
      <AlbumList
        albums={rankedAlbums}
        title={t(($) => $.albums.ranked)}
        subtitle={t(($) => $.albums.ranked_info)}
        showRank
      />
      <AlbumList albums={honorableMentionAlbums} title={t(($) => $.albums.honorable_mentions)} />
    </>
  );
}
