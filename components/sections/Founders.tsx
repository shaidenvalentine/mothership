import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { Media } from "@/components/media/Media";

/**
 * Section 8 — The founders. Condensed merge story: Brandon (Head of Design &
 * Technology) + Shaiden (Head of Sales, Marketing & Branding). Full story
 * lives on /about.
 */
const roles = [
  { name: "Brandon Buckley", role: "Head of Design & Technology" },
  { name: "Shaiden Valentine", role: "Head of Sales, Marketing & Branding" },
];

export function Founders() {
  return (
    <section className="bg-ms-black px-6 py-32 lg:px-16">
      <div className="mx-auto grid max-w-[120rem] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal scaleFrom={1.05}>
          <Media
            src="/images/lounge-warm.jpg"
            alt="A Mothership interior, hand-built in San Diego"
            className="aspect-[4/5] w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>

        <Reveal y={24}>
          <span className="ms-caption">The founders</span>
          <h2 className="mt-6 max-w-xl font-display text-display-lg leading-[1.05] text-ms-bone">
            Two builders. One vision.
          </h2>
          <p className="mt-6 max-w-md text-body-lg text-ms-fog">
            Brandon built the most advanced stealth campervans in the industry.
            Shaiden found him on YouTube, became his student, and mastered the
            brand. Seven years later they merged — Brandon&apos;s engineering and
            3D-printed interiors with Shaiden&apos;s design and storytelling — to
            build the Mothership they&apos;d both always envisioned.
          </p>

          <dl className="mt-10 space-y-5 border-t border-ms-graphite/60 pt-8">
            {roles.map((r) => (
              <div key={r.name}>
                <dt className="font-display text-display-md leading-none text-ms-bone">
                  {r.name}
                </dt>
                <dd className="ms-caption mt-2">{r.role}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-body-sm text-ms-ion transition-opacity hover:opacity-70"
          >
            Read the full story
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
