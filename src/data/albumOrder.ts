import type { Album } from "@/types/album";

export const ranked = {
  "between_the_buried_and_me-the_parallax_ii_future_sequence": 1,
  "the_schoenberg_automaton-apus": 2,
  "soilwork-the_living_infinite": 3,
  "periphery-juggernaut_alphaomega": 4,
  "rivers_of_nihil-where_owls_know_my_name": 5,
  "dimension_zero-he_who_shall_not_bleed": 6,
  "the_contortionist-intrinsic": 7,
  "textures-phenotype": 8,
  "black_crown_initiate-song_of_the_crippled_bull": 9,
  "gojira-from_mars_to_sirius": 10,
  "dessiderium-aria": 11,
  "after_the_burial-wolves_within": 12,
  "dethklok-dethalbum_ii": 13,
  "vola-inmazes": 14,
  "whitechapel-kin": 15,
  "cynic-traced_in_air": 16,
  "corelia-nostalgia": 17,
  "intervals-a_voice_within": 18,
  "devin_townsend_project-ki": 19,
  "killswitch_engage-as_daylight_dies_special_edition": 20,
  "meshuggah-nothing": 21,
  "baroness-purple": 22,
  "system_of_a_down-steal_this_album": 23,
  "substructure-monolith": 24,
  "warrel_dane-praises_to_the_war_machine": 25,
  "in_flames-colony": 26,
  "dark-tranquillity_atoma": 27,
  "the_offspring-smash": 28,
  "opeth-ghost_reveries": 29,
};

export const honorable = {
  "between_the_buried_and_me-colors": 1,
  "black_crown_initiate-selves_we_cannot_forgive": 2,
  "the_contortionist-exoplanet": 3,
  "the_zenith_passage-solipsist": 4,
  "rivers_of_nihil-rivers_of_nihil": 5,
  "between_the_buried_and_me-the_parallax_hypersleep_dialogues": 6,
  "in_flames-reroute_to_remain": 7,
  "between_the_buried_and_me-the_great_misdirect": 8,
  "animals_as_leaders-the_joy_of_motion": 9,
  "the_offspring-americana": 10,
  "between_the_buried_and_me-alaska": 11,
};

export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/ç/g, "c")
    .replace(/ /g, "_")
    .replace(/[^a-z0-9_]/g, "");

const glossary: Record<string, number> = { ...ranked, ...honorable };

export const sortByRank = (albums: Array<Album>): Array<Album> =>
  albums
    .map((a) => ({ a, r: glossary[a.id] ?? Number.POSITIVE_INFINITY }))
    .sort((x, y) => x.r - y.r)
    .map((x) => x.a);
