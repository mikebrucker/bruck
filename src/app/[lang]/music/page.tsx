import { MusicClient } from "@/app/[lang]/music/musicClient";
import { albumRepository } from "@/data/albumRepository";

export default async function MusicPage() {
  const rankedAlbums = await albumRepository.getRanked();

  return <MusicClient rankedAlbums={rankedAlbums} />;
}
