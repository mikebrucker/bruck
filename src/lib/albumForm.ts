import type { AlbumCreateInput, AlbumUpdateInput } from "@/data/albumRepository";
import { creditToForm, parseList, toCreditList } from "@/lib/credit";
import type { Album, AlbumForm, Track, TrackForm } from "@/types/album";

export const emptyTrack = (): TrackForm => ({
  number: "",
  title: "",
  duration: "",
  notes: "",
  instrumental: false,
  disc: "",
  personnel: [],
});

export const emptyForm = (): AlbumForm => ({
  id: "",
  artistId: "",
  album: "",
  year: "",
  label: "",
  genre: "",
  runtime: "",
  discTitles: "",
  art: "",
  tracks: [emptyTrack()],
  personnel: { members: [], guests: [], production: [], studios: "", notes: "" },
});

export function parseNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

type AlbumFieldValues = Omit<AlbumCreateInput, "id">;

const ALBUM_FIELD_KEYS: Array<keyof AlbumFieldValues> = [
  "artistId",
  "album",
  "year",
  "label",
  "genre",
  "runtime",
  "tracks",
  "discTitles",
  "art",
  "personnel",
];

function buildAlbumFields(form: AlbumForm): AlbumFieldValues {
  const studios = parseList(form.personnel.studios);
  const members = toCreditList(form.personnel.members);
  const guests = toCreditList(form.personnel.guests);
  const production = toCreditList(form.personnel.production);
  const personnelNotes = form.personnel.notes.trim() || undefined;
  const hasPersonnel = Boolean(
    members || guests || production || studios.length > 0 || personnelNotes,
  );
  const discTitles = parseList(form.discTitles);
  const art = parseList(form.art);

  return {
    artistId: form.artistId,
    album: form.album.trim(),
    year: parseNumber(form.year) ?? 0,
    label: parseList(form.label),
    genre: parseList(form.genre),
    runtime: form.runtime.trim(),
    tracks: form.tracks.map((track) => ({
      number: parseNumber(track.number) ?? 0,
      title: track.title.trim(),
      duration: track.duration.trim(),
      notes: track.notes.trim() || undefined,
      instrumental: track.instrumental || undefined,
      disc: parseNumber(track.disc),
      personnel: toCreditList(track.personnel),
    })),
    discTitles: discTitles.length > 0 ? discTitles : undefined,
    art: art.length > 0 ? art : undefined,
    personnel: hasPersonnel
      ? { members, guests, production, studios, notes: personnelNotes }
      : undefined,
  };
}

export function buildPayload(form: AlbumForm): AlbumCreateInput {
  return buildAlbumFields(form);
}

function assignChanged<K extends keyof AlbumFieldValues>(
  patch: AlbumUpdateInput,
  values: AlbumFieldValues,
  key: K,
) {
  patch[key] = values[key];
}

export function buildUpdatePayload(original: AlbumForm, current: AlbumForm): AlbumUpdateInput {
  const values = buildAlbumFields(current);
  const patch: AlbumUpdateInput = {};
  for (const key of ALBUM_FIELD_KEYS) {
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      assignChanged(patch, values, key);
    }
  }
  return patch;
}

function trackToForm(track: Track): TrackForm {
  return {
    number: String(track.number),
    title: track.title,
    duration: track.duration,
    notes: track.notes ?? "",
    instrumental: track.instrumental ?? false,
    disc: track.disc !== undefined ? String(track.disc) : "",
    personnel: (track.personnel ?? []).map(creditToForm),
  };
}

export function albumToForm(album: Album): AlbumForm {
  return {
    id: album.id,
    artistId: album.artistId,
    album: album.album,
    year: String(album.year),
    label: album.label.join(", "),
    genre: album.genre.join(", "),
    runtime: album.runtime,
    discTitles: (album.discTitles ?? []).join(", "),
    art: (album.art ?? []).join(", "),
    tracks: album.tracks.length > 0 ? album.tracks.map(trackToForm) : [emptyTrack()],
    personnel: {
      members: (album.personnel?.members ?? []).map(creditToForm),
      guests: (album.personnel?.guests ?? []).map(creditToForm),
      production: (album.personnel?.production ?? []).map(creditToForm),
      studios: (album.personnel?.studios ?? []).join(", "),
      notes: album.personnel?.notes ?? "",
    },
  };
}
