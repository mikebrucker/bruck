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
  instrumental?: boolean;
  personnel?: Array<Credit>;
}

export interface Disc {
  disc: number;
  title?: string;
  tracks: Array<Track>;
}

export interface Album {
  rank: number;
  artist: string;
  album: string;
  year: number;
  label: string;
  genre: string;
  runtime: string;
  review: string;
  discs: Array<Disc>;
  art?: Array<string>;
  personnel?: Personnel;
}

export interface AlbumList {
  ranked: Array<Album>;
  honorableMentions: Array<Album>;
}
