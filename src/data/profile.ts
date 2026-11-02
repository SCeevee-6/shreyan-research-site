/** Education and teaching, as given in the brief and résumé of 1 Nov 2026. */

export const education = {
  school: "Allen High School",
  place: "Allen, Texas",
  standing: "Grade 10 · Class of 2029",
  current: [
    "AP Physics 1",
    "AP Biology",
    "AP World History: Modern",
    "Advanced Precalculus",
    "Advanced Chemistry",
    "English II GT/Phoenix",
    "Advanced Orchestra",
  ],
  earlier: ["Geometry (advanced)", "Algebra II", "Biology", "Spanish II", "AP Human Geography"],
  outside: ["AoPS Calculus", "AP Research", "AP Music Theory", "AP 2D Art", "AP Microeconomics"],
  apExams: [
    ["AP Computer Science A", 5],
    ["AP Computer Science Principles", 5],
    ["AP Human Geography", 5],
    ["AP Precalculus", 5],
    ["AP Seminar", 5],
  ] as [string, number][],
};

/** Teaching and mentoring. Titles are used only where the author has stated them. */
export const teaching: { where: string; what: string; when?: string }[] = [
  {
    where: "Allen Aspire",
    what: "Taught advanced TMSCA competition mathematics in ninth grade — returning to the programme where I had learned algebra the year before.",
  },
  {
    where: "Mustang Math",
    what: "Curriculum development, problem writing and instruction: 50 competition-style problems across algebra, geometry, calculus and discrete mathematics; live online classes for 30+ students preparing for AMC 8/10, MATHCOUNTS and the AIME.",
    when: "2025–",
  },
  {
    where: "PeachTree Math Circle",
    what: "Testsolver and problem writer for olympiad-style mock examinations.",
    when: "2026–",
  },
  {
    where: "Peer tutoring",
    what: "One-on-one and small-group tutoring in algebra, geometry and competition mathematics.",
    when: "2022–",
  },
  {
    where: "FIRST LEGO League",
    what: "Mentor to a team on strategy, mechanisms and autonomous programming; the team won the Robot Design Award at regionals.",
    when: "2022–",
  },
];

/** Programming, as stated by the author on 1 Nov 2026. */
export const programming: { level: string; items: string[] }[] = [
  { level: "Fluent", items: ["Python", "C++", "JavaScript", "HTML/CSS"] },
  { level: "Intermediate", items: ["PyTorch", "Rust", "Java"] },
  { level: "Familiar", items: ["CUDA", "Mojo", "OCaml", "Julia", "R"] },
];

export const libraries: { language: string; items: string[] }[] = [
  { language: "Python", items: ["pandas", "scipy", "numpy", "sympy", "scikit-learn", "statsmodels"] },
  { language: "C++", items: ["SymEngine", "Boost.Math", "Eigen", "Armadillo"] },
  { language: "Rust", items: ["nalgebra", "ndarray", "statrs"] },
];
