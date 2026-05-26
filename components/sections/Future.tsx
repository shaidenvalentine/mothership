import Image from "next/image";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";

/**
 * Section 9 — The future. Where Mothership's design principles go next:
 * vans → private jets → catamarans & yachts, all in the lightest 3D-printed
 * materials.
 */
const verticals = [
  {
    tag: "On land",
    title: "Mothership Vans",
    body: "Where it started — the all-electric, self-charging camper van of the future.",
  },
  {
    tag: "In the air",
    title: "Mothership Jets",
    body: "Private jet interiors, reimagined in the lightest carbon-fiber 3D-printed materials.",
  },
  {
    tag: "At sea",
    title: "Catamarans & Yachts",
    body: "The same design language, brought to the water — lighter and stronger than ever built before.",
  },
];

export function Future() {
  return (
    <section className="relative overflow-hidden bg-ms-black px-6 py-36 lg:px-16">
      <Image
        src="/images/render-desk.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ms-black/85 via-ms-black/80 to-ms-black"
      />

      <div className="relative z-10 mx-auto max-w-[120rem]">
        <Reveal y={12}>
          <span className="ms-caption text-ms-ion">What&apos;s next</span>
        </Reveal>
        <h2 className="mt-6 max-w-4xl font-display text-display-xl leading-[1.04] text-ms-bone">
          <WordReveal text="The same obsession, applied everywhere." />
        </h2>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
            The principles we perfected in the van world — carbon-fiber 3D
            printing, off-grid intelligence, an obsession with finish — don&apos;t
            stop at the road. We&apos;re bringing them everywhere people travel.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 md:grid-cols-3">
          {verticals.map((v, i) => (
            <Reveal
              key={v.title}
              y={24}
              delay={i * 0.1}
              className="bg-ms-black/90 p-10 backdrop-blur-sm lg:p-12"
            >
              <span className="ms-caption text-ms-ion">{v.tag}</span>
              <h3 className="mt-4 font-display text-display-md leading-tight text-ms-bone">
                {v.title}
              </h3>
              <p className="mt-3 text-body text-ms-fog">{v.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal y={16} delay={0.1}>
          <p className="mt-12 max-w-2xl font-display text-display-md leading-tight text-ms-bone/90">
            Lighter, stronger, more beautiful — on land, in the air, and at sea.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
