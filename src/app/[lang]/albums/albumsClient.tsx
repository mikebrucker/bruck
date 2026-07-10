"use client";

import { useTranslation } from "react-i18next";
import { AlbumList } from "@/components/modules/album/albumList";
import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";

type AlbumsClientProps = {
  rankedAlbums: Array<Album>;
  honorableMentionAlbums: Array<Album>;
  userAlbums: Array<UserAlbum>;
};

export function AlbumsClient({
  rankedAlbums,
  honorableMentionAlbums,
  userAlbums,
}: AlbumsClientProps) {
  const { t } = useTranslation();

  return (
    <>
      <AlbumList
        albums={rankedAlbums}
        userAlbums={userAlbums}
        title={t(($) => $.albums.ranked)}
        subtitle={t(($) => $.albums.ranked_info)}
        showRank
        filterKey="ranked"
      />
      <AlbumList
        albums={honorableMentionAlbums}
        userAlbums={userAlbums}
        title={t(($) => $.albums.honorable_mentions)}
        filterKey="honorable-mentions"
      />
    </>
  );
}
