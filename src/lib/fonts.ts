import { Caveat, IBM_Plex_Mono, Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";

export const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--ff-serif",
  display: "swap",
});

export const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--ff-sans",
  display: "swap",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});

/** Handwriting, for red-pencil notes in the margin only. */
export const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--ff-hand",
  display: "swap",
});

/** The structural voice: headings, apparatus, data. Heavy weights carry the display. */
export const display = JetBrains_Mono({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});
