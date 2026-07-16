import { AlbumsClient } from "@/app/[lang]/music/albumsClient";
import { albumRepository } from "@/data/albumRepository";

export default async function AlbumsPage() {
  const rankedAlbums = await albumRepository.getRanked();

  return <AlbumsClient rankedAlbums={rankedAlbums} />;
}
