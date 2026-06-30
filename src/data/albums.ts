import type { Album, JsonAlbum } from "@/types/album";
import honorableMentions from "./honorableMentions.json";
import ranked from "./ranked.json";

function parseFavoriteTrack(value: unknown): Album["favoriteTrack"] {
  if (value == null) return undefined;
  if (typeof value === "number") return value;
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [value[0], value[1]];
  }
}

function validate(albums: Array<JsonAlbum>): Array<Album> {
  return albums.map((a) => ({ ...a, favoriteTrack: parseFavoriteTrack(a.favoriteTrack) }));
}

export const rankedAlbums = validate(ranked.albums);
export const honorableMentionAlbums = validate(honorableMentions.albums);
