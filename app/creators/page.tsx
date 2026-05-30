import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";
import { CreatorBooking } from "@/components/forms/CreatorBooking";

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

const gallery = [
  {
    src: "/images/lounge-golden.jpg",
    alt: "Mothership lounge bathed in golden hour light",
    caption: "Lounge",
  },
  {
    src: "/images/render-kitchen.jpg",
    alt: "Full galley kitchen with induction cooktop and deep basin",
    caption: "Galley",
  },
  {
    src: "/images/render-bed.jpg",
    alt: "Rear sleeping platform with a full-width mattress",
    caption: "Berth",
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
      {/* Hero — full-bleed cinematic */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <Image
          src="/images/hero-exterior-sunset.jpg"
          alt="The Mothership demo van parked against a desert sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/70 to-ms-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ms-black/60 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-24 pt-44 lg:px-16">
          <div className="mx-auto max-w-[120rem]">
            <Reveal y={12}>
              <span className="ms-caption text-ms-ion">Creators</span>
            </Reveal>
            <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
              <WordReveal text="Drive the demo van. Trade content." />
            </h1>
            <Reveal y={16} delay={0.1}>
              <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
                A small, hand-picked program. We give friends and creators we
                trust the keys to the Mothership demo van for a trip; you bring
                the content. No fee, no rental — a fair trade.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The deal */}
      <section className="px-6 py-24 lg:px-16">
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

      {/* What you're driving — interior gallery */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption text-ms-ion">What you&rsquo;re driving</span>
          </Reveal>
          <h2 className="mt-6 max-w-2xl font-display text-display-lg leading-tight text-ms-bone">
            <WordReveal text="A one-of-one, not a rental." />
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
            {gallery.map((shot, i) => (
              <Reveal key={shot.src} scaleFrom={1.06} delay={i * 0.08}>
                <figure>
                  <Media
                    src={shot.src}
                    alt={shot.alt}
                    className="aspect-[3/4] w-full"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                  <figcaption className="mt-3 font-mono text-body-sm text-ms-ash">
                    {shot.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* House rules — paired with imagery */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto grid max-w-[120rem] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal scaleFrom={1.06}>
            <Media
              src="/images/lounge-warm.jpg"
              alt="Warmly lit Mothership interior at dusk"
              className="aspect-[4/5] w-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
          <div>
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
        </div>
      </section>

      {/* Plan your trip — cinematic lead-in */}
      <section className="relative mt-8 overflow-hidden">
        <div className="relative h-[44vh] min-h-[20rem] w-full overflow-hidden">
          <Image
            src="/images/exterior-head-on.jpg"
            alt="The Mothership demo van, head-on, ready for the road"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ms-black/40 via-transparent to-ms-black" />
        </div>
      </section>

      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[100rem]">
          <Reveal y={12}>
            <span className="ms-caption text-ms-ion">Plan your trip</span>
          </Reveal>
          <h2 className="mt-6 max-w-3xl font-display text-display-xl leading-tight text-ms-bone">
            <WordReveal text="See what's open. Claim your dates." />
          </h2>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
              The calendar shows exactly when the demo van is free. Choose your
              window, see what we&rsquo;d expect in exchange, and apply — all in
              one place.
            </p>
          </Reveal>
          <div className="mt-14">
            <CreatorBooking />
          </div>
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
