import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";

/**
 * Section 2 — The opening claim. Three full-screen statements (verbatim from
 * bucksd.com positioning), each revealing word-by-word as it scrolls in.
 */
const claims = [
  "Mercedes Sprinter, reimagined with a proprietary 3D-printed interior.",
  "One design, perfected through years of real-world experience.",
  "Built by hand in San Diego. Delivered anywhere in the continental US.",
];

export function OpeningClaim() {
  return (
    <section className="bg-ms-black">
      {claims.map((claim, i) => (
        <div
          key={claim}
          className="flex min-h-screen items-center justify-center px-6 lg:px-16"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal y={12}>
              <span className="ms-caption">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Reveal>
            <p className="mt-6 font-display text-display-xl leading-[1.05] text-ms-bone">
              <WordReveal text={claim} />
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
