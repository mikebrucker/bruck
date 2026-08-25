import type { ArtistCreateInput, ArtistUpdateInput } from "@/data/artistRepository";
import { creditToForm, parseList, toCreditList } from "@/lib/credit";
import type { Artist, ArtistForm } from "@/types/artist";

export const emptyArtistForm = (): ArtistForm => ({
  id: "",
  artist: "",
  bio: "",
  location: "",
  media: "",
  members: [],
  formerMembers: [],
});

type ArtistFieldValues = ArtistCreateInput;

const ARTIST_FIELD_KEYS: Array<keyof ArtistFieldValues> = [
  "artist",
  "bio",
  "location",
  "media",
  "members",
  "formerMembers",
];

function buildArtistFields(form: ArtistForm): ArtistFieldValues {
  const media = parseList(form.media);

  return {
    artist: form.artist.trim(),
    bio: form.bio.trim() || undefined,
    location: form.location.trim() || undefined,
    media: media.length > 0 ? media : undefined,
    members: toCreditList(form.members),
    formerMembers: toCreditList(form.formerMembers),
  };
}

export function buildArtistPayload(form: ArtistForm): ArtistCreateInput {
  return buildArtistFields(form);
}

function assignChanged<K extends keyof ArtistFieldValues>(
  patch: ArtistUpdateInput,
  values: ArtistFieldValues,
  key: K,
) {
  patch[key] = values[key];
}

export function buildArtistUpdatePayload(
  original: ArtistForm,
  current: ArtistForm,
): ArtistUpdateInput {
  const values = buildArtistFields(current);
  const patch: ArtistUpdateInput = {};
  for (const key of ARTIST_FIELD_KEYS) {
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      assignChanged(patch, values, key);
    }
  }
  return patch;
}

export function artistToForm(artist: Artist): ArtistForm {
  return {
    id: artist.id,
    artist: artist.artist,
    bio: artist.bio ?? "",
    location: artist.location ?? "",
    media: (artist.media ?? []).join(", "),
    members: (artist.members ?? []).map(creditToForm),
    formerMembers: (artist.formerMembers ?? []).map(creditToForm),
  };
}
