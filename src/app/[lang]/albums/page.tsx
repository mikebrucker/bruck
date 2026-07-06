import { AlbumsClient } from "@/app/[lang]/albums/albumsClient";
import { honorable, ranked, sortByRank } from "@/data/albumOrder";
import { albumRepository } from "@/data/albumRepository";

export default async function AlbumsPage() {
  const albums = await albumRepository.getAll();
  const rankedAlbums = sortByRank(albums.filter((album) => album.id in ranked));
  const honorableMentionAlbums = sortByRank(albums.filter((album) => album.id in honorable));

  return (
    <AlbumsClient rankedAlbums={rankedAlbums} honorableMentionAlbums={honorableMentionAlbums} />
  );
}
