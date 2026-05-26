import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "About" };

const story = [
  "Brandon Buckley started by building the most advanced stealth campervans in the industry — quietly turning out some of the nicest, most technologically advanced vans anyone had ever seen, out of a shop in San Diego.",
  "Shaiden Valentine came across Brandon on YouTube and became a huge fan. He reached out, learned to build from him, and effectively apprenticed under Brandon — absorbing everything about how a world-class van comes together.",
  "While Brandon pushed the engineering forward, Shaiden caught up fast — then mastered the other half of the equation: marketing, branding, and sales.",
  "Seven years later, their paths had sharpened. Shaiden had started Mothership. Brandon had moved on to 3D-printed advanced interiors, leading the industry forward.",
  "So they did the obvious thing — they merged. The best of both: Brandon's design and technology, Shaiden's brand and storytelling, in one company.",
  "The result is the new Mothership: an all-electric, self-charging, fully off-grid camper van of the future. The vision they'd both always shared. And now it's ready.",
];

const roles = [
  { name: "Brandon Buckley", role: "Head of Design & Technology" },
  { name: "Shaiden Valentine", role: "Head of Sales, Marketing & Branding" },
];

export default function AboutPage() {
  return (
    <main className="bg-ms-black">
      {/* Intro */}
      <section className="px-6 pt-40 pb-20 lg:px-16">
        <div className="mx-auto max-w-[120rem]">
          <Reveal y={12}>
            <span className="ms-caption">About</span>
          </Reveal>
          <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
            <WordReveal text="How Mothership came together." />
          </h1>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
              Two builders who spent seven years mastering opposite halves of the
              same craft — and finally joined forces.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Hero image */}
      <section className="px-6 lg:px-16">
        <Reveal scaleFrom={1.04} className="mx-auto max-w-[120rem]">
          <Media
            src="/images/hero-exterior-sunset.jpg"
            alt="A Mothership van at sunset"
            className="aspect-[16/9] w-full"
            sizes="100vw"
          />
        </Reveal>
      </section>

      {/* Story */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {story.map((para) => (
            <Reveal key={para} y={20}>
              <p className="text-body-lg leading-relaxed text-ms-fog">{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="px-6 pb-24 lg:px-16">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 sm:grid-cols-2">
          {roles.map((r) => (
            <Reveal key={r.name} y={20} className="bg-ms-black p-10">
              <h2 className="font-display text-display-md leading-none text-ms-bone">
                {r.name}
              </h2>
              <p className="ms-caption mt-3">{r.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-40 text-center lg:px-16">
        <Reveal>
          <Link
            href="/configure"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-ms-bone px-7 text-ms-black hover:bg-ms-paper",
            )}
          >
            Reserve Your Build
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
