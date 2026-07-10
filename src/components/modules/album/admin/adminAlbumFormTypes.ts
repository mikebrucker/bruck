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

export const emptyCredit = (): CreditForm => ({ name: "", roles: "", notes: "" });

export const emptyTrack = (): TrackForm => ({
  number: "",
  title: "",
  duration: "",
  notes: "",
  instrumental: false,
  disc: "",
  personnel: [],
});

export const emptyForm = (): AlbumForm => ({
  id: "",
  artist: "",
  album: "",
  year: "",
  label: "",
  genre: "",
  runtime: "",
  discTitles: "",
  art: "",
  tracks: [emptyTrack()],
  personnel: { members: [], guests: [], production: [], studios: "", notes: "" },
});
