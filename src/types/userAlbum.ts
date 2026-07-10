export interface UserAlbum {
  id: string;
  albumId: string;
  trackId: string | null;
  review: string;
  honorable: boolean;
  rank: number | null;
}
