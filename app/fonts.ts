import { Instrument_Serif, Instrument_Sans, Noto_Naskh_Arabic } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-instrument-serif",
});

/** Italic is used for the emphasised word in the hero heading, so it is preloaded with the roman. */
export const instrumentSerifItalic = Instrument_Serif({
  weight: ["400"],
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-instrument-serif-italic",
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-instrument-sans",
});

export const notoNaskh = Noto_Naskh_Arabic({
  weight: ["400"],
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  variable: "--font-noto-naskh",
});
