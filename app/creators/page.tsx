import type { Metadata } from "next";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { CreatorApplicationForm } from "@/components/forms/CreatorApplicationForm";
import { CreatorCalendar } from "@/components/forms/CreatorCalendar";

export const metadata: Metadata = {
  title: "Creators",
  description:
    "Drive the Mothership demo van. Trade content. A private program for creators we trust.",
};

const dealCards = [
  {
    tag: "What we provide",
    title: "The demo van.",
    body: "Fully built, fully road-ready, prepped before you pick it up.",
  },
  {
    tag: "What you bring",
    title: "Insurance, gas, care.",
    body: "Comprehensive auto insurance in your name, fuel for the trip, and the same care you'd give your own one-of-one.",
  },
  {
    tag: "In exchange",
    title: "Content from the road.",
    body: "Reels, a YouTube short, a long-form trip film — whatever feels true to your work, tagged @mothershipvehicles.",
  },
];

const houseRules = [
  "Treat it like the one-of-one prototype it is.",
  "No heavy off-roading — forest-service roads and light gravel only. No towing.",
  "Smoke-free, pet-considerate, accident-free.",
  "Return it as clean as you got it — or cleaner.",
  "Comprehensive auto insurance in your name is required before pickup.",
];

export default function CreatorsPage() {
  return (
    <main className="bg-ms-black">
      {/* Hero */}
      <section className="px-6 pt-40 pb-20 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption text-ms-ion">Creators</span>
          </Reveal>
          <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
            <WordReveal text="Drive the demo van. Trade content." />
          </h1>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
              A small, hand-picked program. We give friends and creators we trust
              the keys to the Mothership demo van for a trip; you bring the
              content. No fee, no rental — a fair trade.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The deal */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption">The deal</span>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 md:grid-cols-3">
            {dealCards.map((card, i) => (
              <Reveal
                key={card.tag}
                y={20}
                delay={i * 0.08}
                className="bg-ms-black p-10 lg:p-12"
              >
                <span className="ms-caption text-ms-ion">{card.tag}</span>
                <h3 className="mt-4 font-display text-display-md leading-tight text-ms-bone">
                  {card.title}
                </h3>
                <p className="mt-3 text-body text-ms-fog">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* House rules */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Reveal y={12}>
            <span className="ms-caption">House rules</span>
          </Reveal>
          <h2 className="mt-6 font-display text-display-lg leading-tight text-ms-bone">
            <WordReveal text="A few non-negotiables." />
          </h2>
          <ul className="mt-10 divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
            {houseRules.map((rule, i) => (
              <li key={rule}>
                <Reveal y={16} delay={i * 0.06}>
                  <p className="py-5 text-body-lg text-ms-fog">{rule}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Availability */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption">Availability</span>
          </Reveal>
          <h2 className="mt-6 font-display text-display-lg leading-tight text-ms-bone">
            <WordReveal text="When the van is free." />
          </h2>
          <Reveal y={20} delay={0.1} className="mt-10">
            <CreatorCalendar />
          </Reveal>
        </div>
      </section>

      {/* Application */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Reveal y={12}>
            <span className="ms-caption">Application</span>
          </Reveal>
          <h2 className="mt-6 font-display text-display-xl leading-tight text-ms-bone">
            <WordReveal text="Apply to be a creator." />
          </h2>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-xl text-body-lg text-ms-fog">
              Tell us who you are and where you want to take her. Approval is
              per-trip — we review for fit, dates, and route.
            </p>
          </Reveal>
          <Reveal y={24} delay={0.15} className="mt-12">
            <CreatorApplicationForm />
          </Reveal>
        </div>
      </section>

      {/* Fine print */}
      <section className="px-6 pb-40 lg:px-16">
        <Reveal y={12}>
          <p className="mx-auto max-w-3xl text-body-sm text-ms-ash">
            Questions before you apply? Email brandon@bucksd.com or DM
            @mothershipvehicles.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
