export const fields = ["Mathematics", "Computing", "Linguistics", "Biology", "Academic", "Music", "Robotics"] as const;
export type Field = (typeof fields)[number];

export type Distinction = {
  /** As given in the brief; omitted where the brief gives no year. Never estimate one. */
  year?: string;
  title: string;
  body: string;
  field: Field;
  note?: string;
};

/** From the brief of 1 Nov 2026. Scores, ranks and years are copied exactly; nothing is added. */
export const distinctions: Distinction[] = [
  { year: "2026", title: "USA(J)MO qualifier", body: "MAA American Mathematics Competitions", field: "Mathematics" },
  { year: "2026", title: "AIME, 11 / 15", body: "American Invitational Mathematics Examination", field: "Mathematics" },
  { year: "2025", title: "AIME, 11 / 15", body: "American Invitational Mathematics Examination", field: "Mathematics" },
  { year: "2025", title: "AMC 12, 150 / 150", body: "MAA American Mathematics Competitions", field: "Mathematics" },
  { year: "2026", title: "AMC 12, 145.5", body: "MAA American Mathematics Competitions", field: "Mathematics" },
  { year: "2024", title: "AMC 10, 112.5", body: "MAA American Mathematics Competitions", field: "Mathematics" },
  { year: "2025", title: "AMC 8, 25 / 25", body: "MAA American Mathematics Competitions", field: "Mathematics" },
  { year: "2026", title: "Texas team", body: "ARML (American Regions Mathematics League)", field: "Mathematics" },
  { year: "2025", title: "Top 10, Discrete", body: "Berkeley Math Tournament (BMT)", field: "Mathematics" },
  { year: "2025", title: "Texas qualifier", body: "MATHCOUNTS", field: "Mathematics" },
  { year: "2024, 2025", title: "Placements", body: "TMSCA", field: "Mathematics" },
  { year: "2026", title: "Gold division", body: "USA Computing Olympiad (USACO)", field: "Computing" },
  {
    year: "2026",
    title: "Invitational qualifier; 49th in USA/Canada",
    body: "North American Computational Linguistics Open Competition (NACLO)",
    field: "Linguistics",
  },
  { year: "2026", title: "Honorable Mention", body: "USA Biology Olympiad (USABO)", field: "Biology" },
  { year: "2026", title: "AP Scholar with Distinction", body: "College Board", field: "Academic" },
  { year: "2024", title: "All-Region Orchestra, cello", body: "Region 25", field: "Music" },
  { year: "2023–24", title: "State Website Award", body: "BEST Robotics", field: "Robotics" },
];
