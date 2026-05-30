import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { EventsList } from "@/components/events/EventsList";
import { ViewingForm } from "@/components/forms/ViewingForm";

export const metadata: Metadata = {
  title: "See it in person",
  description:
    "Where the Mothership demo van will be next — events, shows, and open houses. Or book a private in-person viewing.",
};

export default function EventsPage() {
  return (
    <main className="bg-ms-black">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src="/images/exterior-front.jpg"
          alt="The Mothership demo van"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/60 to-ms-black/20" />
        <div className="relative z-10 w-full px-6 pb-20 pt-44 lg:px-16">
          <div className="mx-auto max-w-[120rem]">
            <Reveal y={12}>
              <span className="ms-caption text-ms-ion">See it in person</span>
            </Reveal>
            <h1 className="mt-6 max-w-3xl font-display text-display-2xl leading-[0.98] text-ms-bone">
              <WordReveal text="Find the van. Step inside." />
            </h1>
            <Reveal y={16} delay={0.1}>
              <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
                Renders only tell you so much. Here&rsquo;s where the demo van
                will be next — come walk through it, test the systems, and feel
                the 3D-printed interior for yourself.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption">Upcoming</span>
          </Reveal>
          <h2 className="mt-6 font-display text-display-lg leading-tight text-ms-bone">
            <WordReveal text="Where to see it." />
          </h2>
          <div className="mt-12">
            <EventsList />
          </div>
        </div>
      </section>

      {/* Book a viewing */}
      <section id="book" className="scroll-mt-24 px-6 pb-40 lg:px-16">
        <div className="mx-auto grid max-w-[120rem] gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal y={12}>
              <span className="ms-caption text-ms-ion">Private viewing</span>
            </Reveal>
            <h2 className="mt-6 max-w-xl font-display text-display-xl leading-[0.98] text-ms-bone">
              <WordReveal text="Book a time to see it." />
            </h2>
            <Reveal y={16} delay={0.1}>
              <p className="mt-8 max-w-md text-body-lg text-ms-fog">
                Can&rsquo;t make an event, or want one-on-one time with the van?
                Request an in-person viewing — at a show, at the San Diego shop,
                or wherever the van happens to be.
              </p>
            </Reveal>
          </div>
          <Reveal y={24} delay={0.1}>
            <ViewingForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
