import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Display font. Brief specifies PP Editorial New / Söhne Breit (licensed,
 * not bundled here). Fraunces is the sanctioned editorial-serif fallback.
 */
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/** Body font. Brief specifies Söhne; Inter Tight is the sanctioned fallback. */
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
