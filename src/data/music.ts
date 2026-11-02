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
