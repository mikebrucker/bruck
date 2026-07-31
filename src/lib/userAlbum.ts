import type { UserAlbumUpdateInput } from "@/data/userAlbumSchema";
import type { OrderUpdate, UserAlbum, UserAlbumForm } from "@/types/userAlbum";

export const formFromUserAlbum = (userAlbum: UserAlbum | undefined): UserAlbumForm => ({
  trackId: userAlbum?.trackId ?? null,
  review: userAlbum?.review ?? null,
});

export const buildPayload = (
  form: UserAlbumForm,
  originalForm: UserAlbumForm,
): UserAlbumUpdateInput => {
  const payload: UserAlbumUpdateInput = {};
  if (form.trackId !== originalForm.trackId) payload.trackId = form.trackId;
  if (form.review !== originalForm.review) payload.review = form.review;
  return payload;
};

export const applyPatches = (userAlbums: Array<UserAlbum>, updates: Array<OrderUpdate>) => {
  const patchByAlbumId = new Map(updates.map(({ albumId, ...patch }) => [albumId, patch]));
  const next = userAlbums.map((ua) => {
    const patch = patchByAlbumId.get(ua.albumId);
    if (!patch) return ua;
    patchByAlbumId.delete(ua.albumId);
    return { ...ua, ...patch };
  });
  for (const [albumId, patch] of patchByAlbumId) {
    next.push({
      id: "",
      albumId,
      trackId: null,
      review: null,
      honorable: false,
      rank: null,
      createdAt: new Date(),
      ...patch,
    });
  }
  return next;
};

export const mergeUserAlbums = (userAlbums: Array<UserAlbum>, saved: Array<UserAlbum>) => {
  const savedByAlbumId = new Map(saved.map((ua) => [ua.albumId, ua]));
  const next = userAlbums.map((ua) => savedByAlbumId.get(ua.albumId) ?? ua);
  const knownIds = new Set(userAlbums.map((ua) => ua.albumId));
  for (const ua of saved) {
    if (!knownIds.has(ua.albumId)) next.push(ua);
  }
  return next;
};
