import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { Footer } from "@/components/footer/Footer";
import { Nav } from "@/components/nav/Nav";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { site } from "@/content/site";
import { fraunces, interTight, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — The world's first 3D-printed luxury electric van`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — The world's first 3D-printed luxury electric van`,
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
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
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
