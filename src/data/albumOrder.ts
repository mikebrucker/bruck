import type { Album } from "@/types/album";

export const ranked = {
  "between-the-buried-and-me_the-parallax-ii-future-sequence": 1,
  "the-schoenberg-automaton_apus": 2,
  "soilwork_the-living-infinite": 3,
  "periphery_juggernaut-alpha-omega": 4,
  "rivers-of-nihil_where-owls-know-my-name": 5,
  "dimension-zero_he-who-shall-not-bleed": 6,
  "the-contortionist_intrinsic": 7,
  textures_phenotype: 8,
  "black-crown-initiate_song-of-the-crippled-bull": 9,
  "gojira_from-mars-to-sirius": 10,
  dessiderium_aria: 11,
  "after-the-burial_wolves-within": 12,
  "dethklok_dethalbum-ii": 13,
  vola_inmazes: 14,
  whitechapel_kin: 15,
  "cynic_traced-in-air": 16,
  corelia_nostalgia: 17,
  "intervals_a-voice-within": 18,
  "devin-townsend-project_ki": 19,
  "killswitch-engage_as-daylight-dies-special-edition": 20,
  meshuggah_nothing: 21,
  baroness_purple: 22,
  "system-of-a-down_steal-this-album": 23,
  substructure_monolith: 24,
  "warrel-dane_praises-to-the-war-machine": 25,
  "in-flames_colony": 26,
  "the-offspring_smash": 27,
  "opeth_ghost-reveries": 28,
};

export const honorable = {
  "between-the-buried-and-me_colors": 1,
  "black-crown-initiate_selves-we-cannot-forgive": 2,
  "the-contortionist_exoplanet": 3,
  "the-zenith-passage_solipsist": 4,
  "rivers-of-nihil_rivers-of-nihil": 5,
  "between-the-buried-and-me_the-parallax-hypersleep-dialogues": 6,
  "in-flames_reroute-to-remain": 7,
  "between-the-buried-and-me_the-great-misdirect": 8,
  "animals-as-leaders_the-joy-of-motion": 9,
  "the-offspring_americana": 10,
  "between-the-buried-and-me_alaska": 11,
};

export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const glossary: Record<string, number> = { ...ranked, ...honorable };

export const sortByRank = (albums: Array<Album>): Array<Album> =>
  albums
    .map((a) => ({ a, r: glossary[a.id] ?? Number.POSITIVE_INFINITY }))
    .sort((x, y) => x.r - y.r)
    .map((x) => x.a);
