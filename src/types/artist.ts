import type { Credit, CreditForm } from "@/types/album";

export interface Artist {
  id: string;
  artist: string;
  bio?: string;
  location?: string;
  media?: Array<string>;
  members?: Array<Credit>;
  formerMembers?: Array<Credit>;
  createdAt: Date;
  updatedAt?: Date;
}

export type ArtistForm = {
  id: string;
  artist: string;
  bio: string;
  location: string;
  media: string;
  members: Array<CreditForm>;
  formerMembers: Array<CreditForm>;
};
