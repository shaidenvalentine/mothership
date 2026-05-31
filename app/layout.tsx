import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

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
    images: [
      {
        url: "/images/hero-exterior-sunset.jpg",
        width: 1200,
        height: 630,
        alt: "The Mothership — a 3D-printed luxury electric camper van at sunset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Mercedes Sprinter luxury camper vans`,
    description: site.description,
    images: ["/images/hero-exterior-sunset.jpg"],
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
