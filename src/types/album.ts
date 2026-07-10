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
}
