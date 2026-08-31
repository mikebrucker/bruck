import type { Artist } from "@/types/artist";
import type { UserAlbum } from "@/types/userAlbum";

/** Reference only - Credit.roles stays free text */
export type Role =
  | "2nd Engineer"
  | "A&R"
  | "Acoustic Guitar"
  | "Additional Bass"
  | "Additional Composition"
  | "Additional Drums"
  | "Additional Engineer"
  | "Additional Keyboards"
  | "Additional Producer"
  | "Additional Production"
  | "Additional Production Editing"
  | "Additional Songwriting"
  | "Additional Synth/Keyboard Producer"
  | "Additional Synthesizer"
  | "Additional Vocal Tracking"
  | "Alien Noises"
  | "All Instruments"
  | "Arrangements"
  | "Art Concept"
  | "Art Direction"
  | "Art and Design"
  | "Artwork"
  | "Assistant Engineer"
  | "Assistant Producer"
  | "Background Vocals"
  | "Backing Vocals"
  | "Bagpipes"
  | "Bass"
  | "Bass Clarinet"
  | "Bass Pedals"
  | "Bass Trombone"
  | "Cello"
  | "Chapman Stick"
  | "Choir Vocals"
  | "Classical Guitar"
  | "Clean Vocals"
  | "Co-Producer"
  | "Co-writer"
  | "Composition"
  | "Computer Illustrations"
  | "Concept Design"
  | "Design"
  | "Didgeridoo"
  | "Digital Editing"
  | "Double Bass"
  | "Drum Programming"
  | "Drum Technician"
  | "Drums"
  | "Electric Guitar"
  | "Electric Piano"
  | "Electronics"
  | "Engineer"
  | "Executive Producer"
  | "Fiddle"
  | "Flute"
  | "French Horn"
  | "Fretless Bass"
  | "Grand Piano"
  | "Growls"
  | "Guest Guitar Solo"
  | "Guest Synth Solo"
  | "Guest Vocals"
  | "Guitar"
  | "Guitar Effects"
  | "Guitar Synthesizer"
  | "Guitar Technician"
  | "Guitarrón"
  | "Guitars"
  | "Hammond Organ"
  | "Harsh Vocals"
  | "Horns"
  | "Illustrations"
  | "Keyboards"
  | "Keys"
  | "Lap Steel Guitar"
  | "Layout"
  | "Lead Guitar"
  | "Lead Vocals"
  | "Lute"
  | "Lyrics"
  | "Machines"
  | "Mascot"
  | "Mastering Engineer"
  | "Mellotron"
  | "Mix Assistant"
  | "Mixer"
  | "Mixing Assistance"
  | "Model"
  | "Moog"
  | "Orchestration"
  | "Organ"
  | "Percussion"
  | "Photography"
  | "Piano"
  | "Pro Tools"
  | "Pro Tools Assistance"
  | "Producer"
  | "Production"
  | "Programming"
  | "Rhythm Guitar"
  | "Samples"
  | "Sampling"
  | "Saxophone"
  | "Slide Guitar"
  | "Sound Effects"
  | "Spoken Vocals"
  | "Spoken Word"
  | "String Arrangement"
  | "String Production"
  | "Synthesizer"
  | "Tenor Saxophone"
  | "Theremin"
  | "Trombone"
  | "Trumpet"
  | "Tuba"
  | "Turntables"
  | "Twelve-String Guitar"
  | "Vihuela"
  | "Viola"
  | "Violin"
  | "Vocal Producer"
  | "Vocals"
  | "Vocoder";

/** Reference only - Album.genre stays free text */
export type Genre =
  | "Alternative Metal"
  | "Alternative Rock"
  | "Ambient Rock"
  | "Avant-Garde Metal"
  | "Blackened Death Metal"
  | "Blackened Deathcore"
  | "Classic Rock"
  | "Death Metal"
  | "Deathcore"
  | "Deathgrind"
  | "Djent"
  | "Doom Metal"
  | "Experimental Hip Hop"
  | "Folk Metal"
  | "Funeral Doom"
  | "Funk Metal"
  | "Gothic Metal"
  | "Groove Metal"
  | "Grunge"
  | "Hard Rock"
  | "Heavy Metal"
  | "Jazz Fusion"
  | "Mathcore"
  | "Melodic Death Metal"
  | "Melodic Metalcore"
  | "Metalcore"
  | "Nu Metal"
  | "Pop Punk"
  | "Post-Black Metal"
  | "Post-Rock"
  | "Power Metal"
  | "Progressive Black Metal"
  | "Progressive Death Metal"
  | "Progressive Deathcore"
  | "Progressive Extreme Metal"
  | "Progressive Metal"
  | "Progressive Metalcore"
  | "Progressive Rock"
  | "Psychedelic Black Metal"
  | "Punk Rock"
  | "Rap"
  | "Rap Metal"
  | "Rap Rock"
  | "Shoegaze"
  | "Skate Punk"
  | "Sludge Metal"
  | "Southern Hip Hop"
  | "Stoner Rock"
  | "Symphonic Deathcore"
  | "Symphonic Metal"
  | "Technical Death Metal"
  | "Thrash Metal"
  | "Underground Hip Hop";

/** Reference only - Album.label stays free text */
export type RecordLabel =
  | "20 Buck Spin"
  | "Abraxan Hymns"
  | "American"
  | "Anthem"
  | "Atlantic Records"
  | "Basick"
  | "Black Market Activities"
  | "Century Media"
  | "Columbia"
  | "Debemur Morti Productions"
  | "Definitive Jux"
  | "Distort Entertainment"
  | "Dream On"
  | "DreamWorks Records"
  | "eOne"
  | "Epic"
  | "Epitaph"
  | "Flip Records"
  | "Good Fight"
  | "Harvest Records"
  | "HevyDevy"
  | "Immortal Records"
  | "InsideOut"
  | "Interscope Records"
  | "Lifeblood"
  | "Listenable"
  | "Maverick Records"
  | "Mercury Records"
  | "Metal Blade"
  | "Napalm Records"
  | "New Damage Records"
  | "Nuclear Blast"
  | "Peaceville Records"
  | "Prosthetic"
  | "Razor & Tie"
  | "Relapse Records"
  | "Rise Records"
  | "Roadrunner"
  | "Season of Mist"
  | "Self-released"
  | "Spinefarm Records"
  | "Sumerian Records"
  | "Svart Records"
  | "TVT Records"
  | "The Artisan Era"
  | "UNFD"
  | "Unique Leader"
  | "Vertigo Records"
  | "Vic Records"
  | "Victory"
  | "Volcano"
  | "Warner Bros. Records"
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
  artistId: string;
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
  /** Joined from the artists table in AlbumRepository */
  artist: Artist;
  /** Per-user data joined in AlbumRepository.getRanked */
  userAlbum?: UserAlbum;
  inheritedRank?: number;
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
  artistId: string;
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
