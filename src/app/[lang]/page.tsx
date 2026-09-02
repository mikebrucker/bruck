import { HomeClient } from "@/app/[lang]/homeClient";
import { albumRepository } from "@/data/albumRepository";

export default async function HomePage() {
  const albumArt = await albumRepository.getArt();

  return <HomeClient albumArt={albumArt} />;
}
