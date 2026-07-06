import { HomeClient } from "@/app/[lang]/homeClient";
import { honorable, ranked, sortByRank } from "@/data/albumOrder";
import { albumRepository } from "@/data/albumRepository";

export default async function Home() {
  const albums = await albumRepository.getAll();
  const rankedAlbums = sortByRank(albums.filter((album) => album.id in ranked));
  const honorableMentionAlbums = sortByRank(albums.filter((album) => album.id in honorable));

  return <HomeClient rankedAlbums={rankedAlbums} honorableMentionAlbums={honorableMentionAlbums} />;
}
