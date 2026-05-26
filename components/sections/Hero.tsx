import Image from "next/image";

import { site } from "@/content/site";

/**
 * Section 1 — Hero. Phase 1 static placeholder: headline over a dimmed
 * exterior shot. Phase 2 replaces this with the 200vh pinned 360° van
 * rotation (image-sequence first, R3F glTF later).
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Backdrop */}
      <Image
        src="/images/hero-exterior-sunset.jpg"
        alt="A Mothership van parked on a ridge at sunset, awning extended"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ms-black/80 via-ms-black/55 to-ms-black"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="ms-caption mb-8 text-ms-bone/80">
          The world&apos;s first 3D-printed luxury electric van
        </p>
        <h1 className="max-w-5xl text-balance font-display text-display-2xl leading-[0.95] text-ms-bone drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
          {site.tagline}
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="ms-caption">Scroll</span>
        <span aria-hidden className="h-10 w-px bg-ms-fog/50" />
      </div>
    </section>
  );
}
