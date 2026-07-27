import type { UserAlbum } from "@/types/userAlbum";

/** Reference only - Credit.roles stays free text */
export type Role =
  | "Vocals"
  | "Guest Vocals"
  | "Lead Vocals"
  | "Backing Vocals"
  | "Background Vocals"
  | "Clean Vocals"
  | "Choir Vocals"
  | "Growls"
  | "Guitar"
  | "Guitars"
  | "Electric Guitar"
  | "Acoustic Guitar"
  | "Classical Guitar"
  | "Lap Steel Guitar"
  | "Lead Guitar"
  | "Rhythm Guitar"
  | "Slide Guitar"
  | "Guitar Effects"
  | "Guitar Synthesizer"
  | "Bass"
  | "Fretless Bass"
  | "Chapman Stick"
  | "Additional Bass"
  | "Drums"
  | "Percussion"
  | "Drum Programming"
  | "Keyboards"
  | "Additional Keyboards"
  | "Piano"
  | "Grand Piano"
  | "Electric Piano"
  | "Keys"
  | "Mellotron"
  | "Hammond Organ"
  | "Organ"
  | "Moog"
  | "Synthesizer"
  | "Additional Synthesizer"
  | "Theremin"
  | "Violin"
  | "Viola"
  | "Cello"
  | "Fiddle"
  | "Tuba"
  | "Flute"
  | "Tenor Saxophone"
  | "Saxophone"
  | "Bass Clarinet"
  | "Electronics"
  | "Programming"
  | "Machines"
  | "Spoken Word"
  | "All Instruments"
  | "Producer"
  | "Additional Producer"
  | "Assistant Producer"
  | "Vocal Producer"
  | "Co-writer"
  | "Additional Songwriting"
  | "Engineer"
  | "Assistant Engineer"
  | "Additional Engineer"
  | "Mixer"
  | "Mixing Assistance"
  | "Mix Assistant"
  | "Mastering Engineer"
  | "Additional Production"
  | "Additional Production Editing"
  | "String Production"
  | "Digital Editing"
  | "Production"
  | "Artwork"
  | "Art Direction"
  | "Art Concept"
  | "Design"
  | "Layout"
  | "Concept Design"
  | "Art and Design"
  | "Photography"
  | "Illustrations"
  | "Computer Illustrations"
  | "Model"
  | "Guitar Technician"
  | "Drum Technician"
  | "Guest Guitar Solo";

export interface Credit {
  name: string;
  roles: Array<string>;
  notes?: string;
}

export interface Personnel {
  members?: Array<Credit>;
  guests?: Array<Credit>;
  production?: Array<Credit>;
  studios?: Array<string>;
  notes?: string;
}

export interface Track {
  number: number;
  title: string;
  duration: string;
  notes?: string;
  instrumental?: boolean;
  personnel?: Array<Credit>;
  /** 0 indexed; Only used when multi-disc; */
  disc?: number;
}

export interface Album {
  id: string;
  artist: string;
  album: string;
  year: number;
  label: string;
  genre: string;
  runtime: string;
  tracks: Array<Track>;
  discTitles?: Array<string>;
  art?: Array<string>;
  personnel?: Personnel;
  createdAt: Date;
  updatedAt?: Date;
  honorableMentions?: Array<Album>;
  /** Per-user data (review, favorite track) joined in AlbumRepository.getRanked */
  userAlbum?: UserAlbum;
}

export type CreditForm = { name: string; roles: string; notes: string };

export type TrackForm = {
  number: string;
  title: string;
  duration: string;
  notes: string;
  instrumental: boolean;
  disc: string;
  personnel: Array<CreditForm>;
};

export type PersonnelForm = {
  members: Array<CreditForm>;
  guests: Array<CreditForm>;
  production: Array<CreditForm>;
  studios: string;
  notes: string;
};

export type AlbumForm = {
  id: string;
  artist: string;
  album: string;
  year: string;
  label: string;
  genre: string;
  runtime: string;
  discTitles: string;
  art: string;
  tracks: Array<TrackForm>;
  personnel: PersonnelForm;
};
