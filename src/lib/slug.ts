/** Mirrors the SQL expression behind the generated artists.id and albums.id columns */
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
