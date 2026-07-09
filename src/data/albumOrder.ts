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
  "the_zenith_passage-solipsist": 19,
  "devin_townsend_project-ki": 20,
  "killswitch_engage-as_daylight_dies_special_edition": 21,
  "meshuggah-nothing": 22,
  "baroness-purple": 23,
  "system_of_a_down-steal_this_album": 24,
  "substructure-monolith": 25,
  "warrel_dane-praises_to_the_war_machine": 26,
  "in_flames-colony": 27,
  "dark-tranquillity_atoma": 28,
  "the_offspring-smash": 29,
  "opeth-ghost_reveries": 30,
};

export const honorable = {
  "between_the_buried_and_me-colors": 1001,
  "black_crown_initiate-selves_we_cannot_forgive": 1002,
  "the_contortionist-exoplanet": 1003,
  "rivers_of_nihil-rivers_of_nihil": 1004,
  "between_the_buried_and_me-the_parallax_hypersleep_dialogues": 1005,
  "in_flames-reroute_to_remain": 1006,
  "between_the_buried_and_me-the_great_misdirect": 1007,
  "animals_as_leaders-the_joy_of_motion": 1008,
  "the_offspring-americana": 1009,
  "between_the_buried_and_me-alaska": 1000,
};

const glossary: Record<string, number> = { ...ranked, ...honorable };

export const sortByRank = (albums: Array<Album>): Array<Album> =>
  albums
    .map((a) => ({ a, r: glossary[a.id] ?? Number.POSITIVE_INFINITY }))
    .sort((x, y) => x.r - y.r)
    .map((x) => x.a);
