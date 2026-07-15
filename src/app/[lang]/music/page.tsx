import { AlbumsClient } from "@/app/[lang]/music/albumsClient";
import { albumRepository } from "@/data/albumRepository";
import { userAlbumRepository } from "@/data/userAlbumRepository";

export default async function AlbumsPage() {
  const [rankedAlbums, userAlbums] = await Promise.all([
    albumRepository.getRanked(),
    userAlbumRepository.getAll(),
  ]);

  return <AlbumsClient rankedAlbums={rankedAlbums} userAlbums={userAlbums} />;
}
