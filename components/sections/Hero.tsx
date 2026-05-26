import { site } from "@/content/site";

/**
 * Section 1 — Hero. Phase 1 is a static placeholder: the headline centered on
 * black. Phase 2 replaces this with the 200vh pinned 360° van rotation
 * (image-sequence first, R3F glTF later).
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-ms-black px-6 text-center">
      <p className="ms-caption mb-8">The world&apos;s first 3D-printed luxury electric van</p>
      <h1 className="max-w-5xl text-balance font-display text-display-2xl leading-[0.95] text-ms-bone">
        {site.tagline}
      </h1>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="ms-caption">Scroll</span>
        <span aria-hidden className="h-10 w-px bg-ms-graphite" />
      </div>
    </section>
  );
}
