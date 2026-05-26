import Image from "next/image";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";

/**
 * Section 2 — The opening claim. Three full-screen statements over dimmed
 * imagery, each revealing word-by-word as it scrolls in.
 */
const claims = [
  {
    text: "All-electric. Self-charging. Off-grid for weeks.",
    image: "/images/exterior-head-on.jpg",
  },
  {
    text: "A proprietary 3D-printed interior — carbon-fiber light, impossibly strong.",
    image: "/images/render-consoles.png",
  },
  {
    text: "Two builders. Seven years. One vision, finally merged.",
    image: "/images/lounge-golden.jpg",
  },
];

export function OpeningClaim() {
  return (
    <section className="bg-ms-black">
      {claims.map((claim, i) => (
        <div
          key={claim.text}
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 lg:px-16"
        >
          <Image
            src={claim.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-ms-black/72"
          />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <Reveal y={12}>
              <span className="ms-caption">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Reveal>
            <p className="mt-6 font-display text-display-xl leading-[1.05] text-ms-bone">
              <WordReveal text={claim.text} />
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
