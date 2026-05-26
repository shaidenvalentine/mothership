import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { Footer } from "@/components/footer/Footer";
import { Nav } from "@/components/nav/Nav";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { site } from "@/content/site";
import { geist, interTight, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Mercedes Sprinter luxury camper vans`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Mercedes Sprinter luxury camper vans`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LenisProvider>
          <Nav />
          {children}
          <Footer />
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
