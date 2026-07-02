"use client";

import AlbumCard from "@/components/modules/albumCard";
import { Accordion } from "@/components/ui/accordion";
import type { Album } from "@/types/album";

type AlbumListProps = {
  albums: Array<Album>;
  title: string;
  subtitle?: string;
  showRank?: boolean;
};

export function AlbumList({ albums, title, subtitle, showRank }: AlbumListProps) {
  return (
    <Accordion
      title={title}
      subtitle={subtitle}
      size="xl"
      classNames="hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors duration-300 rounded-lg px-1"
      duration={1000}
    >
      {albums.map((album, i) => (
        <AlbumCard key={album.id} rank={showRank ? i + 1 : undefined} album={album} />
      ))}
    </Accordion>
  );
}
