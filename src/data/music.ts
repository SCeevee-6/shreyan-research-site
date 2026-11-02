/** Music, as supplied by the author on 1 Nov 2026. More will be supplied; add nothing that has not been. */

export const instrument = { name: "Cello", since: "2022" };

/** Orchestras, newest first. `when` is left out where none was given. */
export const ensembles: { what: string; detail?: string; when?: string }[] = [
  { what: "Advanced Orchestra", detail: "Allen High School", when: "Current" },
  { what: "All-Region Orchestra", detail: "Region 25", when: "2024" },
];

/** Studies currently in progress, by composer, set out as a programme would print them. */
export const inStudy: { composer: string; numbers: string[] }[] = [
  { composer: "Popper", numbers: ["No. 18", "No. 22", "No. 27"] },
  { composer: "Schroeder", numbers: ["No. 42", "No. 143"] },
];

/**
 * Practice log: one digit per day, one group per week (Monday first), oldest week first.
 * 0 = none, 1 = under 20 min, 2 = 20–40, 3 = 40–60, 4 = over an hour.
 * PLACEHOLDER — a plausible pattern for a serious high-school cellist; replace with the real log.
 */
export const practiceLog =
  "0421313 3323223 2330314 3124314 4422303 2224214 0222204 0223413 0000014 0403214 2342304 2223304 0210404 " +
  "1221424 3432001 0213213 3123111 4240404 2321111 3332004 1330324 4321323 1232214 2321224 2341203 2342103";

export const practiceLevels = ["no practice", "under 20 minutes", "20–40 minutes", "40–60 minutes", "over an hour"];
