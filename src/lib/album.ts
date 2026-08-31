import type { Album } from "@/types/album";

/** Flatten ranked and honorable mention albums */
export const artistAlbums = (albums: Array<Album>, artistId: string): Array<Album> => {
  const byId = new Map<string, Album>();

  for (const album of albums) {
    for (const entry of [album, ...(album.honorableMentions ?? [])]) {
      if (entry.artistId !== artistId || byId.has(entry.id)) continue;
      const { honorableMentions, ...rest } = entry;
      byId.set(entry.id, rest);
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.year - b.year);
};

export const parseRuntimeSeconds = (runtime: string): number => {
  const parts = runtime.split(":").map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  const [minutes, seconds] = parts;
  return minutes * 60 + seconds;
};

export const formatRuntimeSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  return `${minutes}:${String(remainderSeconds).padStart(2, "0")}`;
};
