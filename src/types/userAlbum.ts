export interface UserAlbum {
  id: string;
  albumId: string;
  trackId: string | null;
  review: string | null;
  honorable: boolean;
  rank: number | null;
  createdAt: Date;
  updatedAt?: Date;
}

export type OrderPatch = { honorable?: boolean; rank?: number | null };
export type OrderUpdate = { albumId: string } & OrderPatch;

export type UserAlbumForm = {
  trackId: string | null;
  review: string | null;
};
