export interface Track {
  number: number;
  title: string;
  duration: string;
  instrumental?: boolean;
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
}

export interface AlbumList {
  ranked: Array<Album>;
  honorableMentions: Array<Album>;
}
