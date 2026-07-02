import type { Album } from "@/types/album";
import honorableMentions from "./honorableMentions.json";
import ranked from "./ranked.json";

export const rankedAlbums: Array<Album> = ranked.albums;
export const honorableMentionAlbums: Array<Album> = honorableMentions.albums;
