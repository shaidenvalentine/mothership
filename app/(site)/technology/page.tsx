import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";

export const metadata: Metadata = {
  title: "The Build",
  description:
    "How the Mothership is made — a proprietary, aerospace-grade carbon-fiber 3D-printed interior on the Mercedes Sprinter, all-electric and self-charging, hand-built in San Diego.",
};

const pillars = [
  {
    title: "Printed, not assembled",
    body: "The interior is printed as continuous, organic forms instead of cut, screwed, and glued from flat panels. Fewer seams, fewer rattles, no hardware to loosen on rough roads — and shapes that simply can't be built by hand.",
  },
  {
    title: "Aerospace-grade composite",
    body: "We print in a carbon-fiber composite: light, immensely strong, waterproof, and mold-resistant. The same logic as an aircraft cabin — strength where it matters, weight nowhere it doesn't.",
  },
  {
    title: "Systems printed in",
    body: "Ducting, wiring, and channels are routed inside the printed structure, not bolted on after. Every visible surface stays clean and intentional, and service points are designed in from the start.",
  },
  {
    title: "Finished in real materials",
    body: "The composite is the skeleton; the skin is real wood, leather, and stone. Premium where you touch it, engineered where you don't.",
  },
];

const systems = [
  {
    title: "All-electric, self-charging",
    body: "No propane, no generator. A large battery bank with solar and drive charging keeps you fully off-grid for extended stays.",
  },
  {
    title: "On the Mercedes Sprinter",
    body: "Built on the platform that's proven itself for a decade — 144\" or 170\" wheelbase, the chassis the rest of the industry trusts.",
  },
  {
    title: "Hand-built in San Diego",
    body: "Printed and assembled in our own shop, quality-controlled by the team that designed it, then delivered anywhere in the continental US.",
  },
];

export default function TheBuildPage() {
  return (
    <main className="bg-ms-black">
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden">
        <Media
          src="/images/render-consoles.png"
          alt="The 3D-printed Mothership interior — organic, seamless console forms"
          className="absolute inset-0 rounded-none border-0"
          imageClassName="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/60 to-ms-black/20" />
        <div className="relative z-10 w-full px-6 pb-20 pt-44 lg:px-16">
          <div className="mx-auto max-w-[120rem]">
            <Reveal y={12}>
              <span className="ms-caption text-ms-ion">The build</span>
            </Reveal>
            <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
              <WordReveal text="A proprietary 3D-printed interior." />
            </h1>
            <Reveal y={16} delay={0.1}>
              <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
                Most luxury vans are coachbuilt — flat panels cut and fitted by
                hand. The Mothership is printed. That single decision changes
                everything about how it looks, lasts, and lives.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption">Why printed</span>
          </Reveal>
          <h2 className="mt-6 max-w-3xl font-display text-display-lg leading-tight text-ms-bone">
            <WordReveal text="Engineering you feel, not just specs you read." />
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 md:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} y={20} delay={(i % 2) * 0.08} className="bg-ms-black p-10 lg:p-12">
                <h3 className="font-display text-display-md leading-tight text-ms-bone">
                  {p.title}
                </h3>
                <p className="mt-4 text-body text-ms-fog">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image break */}
      <section className="px-6 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal scaleFrom={1.04}>
            <Media
              src="/images/systems-rear-doors.jpg"
              alt="Systems integrated behind the Mothership's rear doors"
              className="aspect-[21/9] w-full"
              sizes="100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* Systems */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption text-ms-ion">The systems</span>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {systems.map((s, i) => (
              <Reveal key={s.title} y={20} delay={i * 0.08}>
                <h3 className="font-display text-display-md leading-tight text-ms-bone">
                  {s.title}
                </h3>
                <p className="mt-3 text-body text-ms-fog">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-40 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={20}>
            <div className="flex flex-col items-start gap-6 border-t border-ms-graphite/60 pt-12 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl font-display text-display-md leading-tight text-ms-bone">
                See it across every space.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/vans"
                  className="rounded-md border border-ms-graphite px-6 py-3 text-ms-bone transition hover:border-ms-bone"
                >
                  Explore the build
                </Link>
                <Link
                  href="/configure"
                  className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
                >
                  Reserve yours
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
