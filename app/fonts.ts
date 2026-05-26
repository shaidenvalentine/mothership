import { Geist, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Display font — Geist. Clean modern grotesque; the technical/luxury feel of
 * Tesla / Polestar / Apple product pages. Used for all headlines.
 */
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/** Body font — Inter Tight. Neutral, tight grotesque for copy. */
export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/** Mono — captions, specs, numeric ornament. */
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});
