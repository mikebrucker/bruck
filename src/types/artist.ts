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

/** Reference only - artists.artist stays free text */
export type KnownArtist =
  | "After the Burial"
  | "Alice in Chains"
  | "Allegaeon"
  | "Alluvial"
  | "Animals as Leaders"
  | "Archspire"
  | "Arkaik"
  | "Baroness"
  | "Between the Buried and Me"
  | "Black Crown Initiate"
  | "Black Sabbath"
  | "Born of Osiris"
  | "Cattle Decapitation"
  | "Children of Bodom"
  | "Corelia"
  | "Cynic"
  | "Dark Tranquillity"
  | "Death"
  | "Deftones"
  | "Dessiderium"
  | "Dethklok"
  | "Devin Townsend Project"
  | "Dimension Zero"
  | "El-P"
  | "Gojira"
  | "In Flames"
  | "Insomnium"
  | "Intervals"
  | "Killer Mike"
  | "Killswitch Engage"
  | "Korn"
  | "Lamb of God"
  | "Limp Bizkit"
  | "Lorna Shore"
  | "Machine Head"
  | "Mastodon"
  | "Meshuggah"
  | "Mudvayne"
  | "Ne Obliviscaris"
  | "Nekrogoblikon"
  | "Nevermore"
  | "Northlane"
  | "Nothingface"
  | "Opeth"
  | "Oranssi Pazuzu"
  | "Papa Roach"
  | "Periphery"
  | "Pink Floyd"
  | "Protest the Hero"
  | "Rage Against the Machine"
  | "Rivers of Nihil"
  | "Rush"
  | "Scar Symmetry"
  | "Shadow of Intent"
  | "Shadows Fall"
  | "SikTh"
  | "Soilwork"
  | "Substructure"
  | "Swallow the Sun"
  | "System of a Down"
  | "Textures"
  | "The Contortionist"
  | "The Faceless"
  | "The Odious"
  | "The Offspring"
  | "The Schoenberg Automaton"
  | "The Zenith Passage"
  | "Tool"
  | "VOLA"
  | "Vale of Pnath"
  | "Veil of Maya"
  | "Virvum"
  | "Warrel Dane"
  | "White Ward"
  | "Whitechapel";
