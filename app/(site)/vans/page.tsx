import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";
import { vans } from "@/content/vans";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Inside the Mothership — the stealth exterior, the lounge, the galley, and the bedroom. One design, perfected across every space.",
};

export default function VansPage() {
  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <Reveal y={12}>
          <span className="ms-caption text-ms-ion">The gallery</span>
        </Reveal>
        <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
          <WordReveal text="Inside the Mothership." />
        </h1>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
            One design, perfected across every space — a stealth exterior over a
            3D-printed interior of real wood, leather, and stone. Step into each
            room.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {vans.map((van, i) => (
            <Reveal key={van.slug} scaleFrom={1.04} delay={(i % 2) * 0.08}>
              <Link href={`/vans/${van.slug}`} className="group block">
                <Media
                  src={van.image}
                  alt={`${van.title} — ${van.platform}`}
                  className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.01]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="mt-4 flex items-baseline justify-between">
                  <h2 className="font-display text-display-md leading-none text-ms-bone">
                    {van.title}
                  </h2>
                  <span className="ms-caption text-ms-ash transition-colors group-hover:text-ms-ion">
                    View →
                  </span>
                </div>
                <p className="mt-2 text-body text-ms-fog">{van.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal y={20}>
          <div className="mt-24 flex flex-col items-start gap-6 border-t border-ms-graphite/60 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl font-display text-display-md leading-tight text-ms-bone">
              Ready to make it yours?
            </p>
            <Link
              href="/configure"
              className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
            >
              Reserve your Mothership
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
