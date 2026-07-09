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

export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/ç/g, "c")
    .replace(/ /g, "_")
    .replace(/[^a-z0-9_]/g, "");
