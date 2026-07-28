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

/** Reference only - Album.genre stays free text */
export type Genre =
  | "Alternative Metal"
  | "Ambient Rock"
  | "Avant-Garde Metal"
  | "Blackened Death Metal"
  | "Classic Rock"
  | "Death Metal"
  | "Deathcore"
  | "Djent"
  | "Gothic Metal"
  | "Groove Metal"
  | "Heavy Metal"
  | "Jazz Fusion"
  | "Mathcore"
  | "Melodic Death Metal"
  | "Metalcore"
  | "Nu Metal"
  | "Pop Punk"
  | "Progressive Black Metal"
  | "Progressive Death Metal"
  | "Progressive Deathcore"
  | "Progressive Extreme Metal"
  | "Progressive Metal"
  | "Progressive Metalcore"
  | "Progressive Rock"
  | "Punk Rock"
  | "Rap Metal"
  | "Skate Punk"
  | "Sludge Metal"
  | "Stoner Rock"
  | "Technical Death Metal"
  | "Thrash Metal";

/** Reference only - Album.artist stays free text */
export type Artist =
  | "After the Burial"
  | "Animals as Leaders"
  | "Baroness"
  | "Between the Buried and Me"
  | "Black Crown Initiate"
  | "Corelia"
  | "Cynic"
  | "Dark Tranquillity"
  | "Dessiderium"
  | "Dethklok"
  | "Devin Townsend Project"
  | "Dimension Zero"
  | "Gojira"
  | "In Flames"
  | "Intervals"
  | "Killswitch Engage"
  | "Lamb of God"
  | "Meshuggah"
  | "Ne Obliviscaris"
  | "Opeth"
  | "Papa Roach"
  | "Periphery"
  | "Pink Floyd"
  | "Protest the Hero"
  | "Rivers of Nihil"
  | "Soilwork"
  | "Substructure"
  | "System of a Down"
  | "Textures"
  | "The Contortionist"
  | "The Faceless"
  | "The Offspring"
  | "The Schoenberg Automaton"
  | "The Zenith Passage"
  | "Tool"
  | "VOLA"
  | "Vale of Pnath"
  | "Virvum"
  | "Warrel Dane"
  | "Whitechapel";

/** Reference only - Album.label stays free text */
export type RecordLabel =
  | "Abraxan Hymns"
  | "American"
  | "Basick"
  | "Century Media"
  | "Columbia"
  | "DreamWorks Records"
  | "eOne"
  | "Epic"
  | "Epitaph"
  | "Good Fight"
  | "Harvest Records"
  | "HevyDevy"
  | "InsideOut"
  | "Lifeblood"
  | "Listenable"
  | "Metal Blade"
  | "Nuclear Blast"
  | "Prosthetic"
  | "Razor & Tie"
  | "Roadrunner"
  | "Season of Mist"
  | "Self-released"
  | "Sumerian Records"
  | "The Artisan Era"
  | "Unique Leader"
  | "Vic Records"
  | "Victory"
  | "Volcano"
  | "Williams Street"
  | "Willowtip Records"
  | "Zoo";

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
  artist: string | Artist;
  album: string;
  year: number;
  label: Array<string | RecordLabel>;
  genre: Array<string | Genre>;
  runtime: string;
  tracks: Array<Track>;
  discTitles?: Array<string>;
  art?: Array<string>;
  personnel?: Personnel;
  createdAt: Date;
  updatedAt?: Date;
  honorableMentions?: Array<Album>;
  /** Per-user data joined in AlbumRepository.getRanked */
  userAlbum?: UserAlbum;
  /** Resolved from userAlbum.trackId in AlbumRepository.getRanked; undefined when unset or stale */
  favoriteTrack?: Track;
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
