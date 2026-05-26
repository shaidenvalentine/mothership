import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";
import { features } from "@/content/features";

/**
 * Section 3 — Cinematic feature reveals. Eight full-screen panels. The image
 * settles in as the panel enters; the headline reveals word-by-word with the
 * caption / spec / link staggering in beneath it.
 */
export function FeatureReveals() {
  return (
    <section className="bg-ms-black">
      {features.map((feature, i) => (
        <div
          key={feature.id}
          className="flex min-h-screen items-center px-6 py-24 lg:px-16"
        >
          <div className="mx-auto grid w-full max-w-[120rem] items-center gap-12 lg:grid-cols-2">
            {/* Media — alternate sides */}
            <Reveal
              scaleFrom={1.06}
              className={i % 2 === 1 ? "lg:order-2" : ""}
            >
              <Media
                src={feature.image}
                alt={feature.title}
                className="aspect-[4/3] w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>

            {/* Copy */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <Reveal y={16}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-display-md leading-none text-ms-graphite">
                    {feature.index}
                  </span>
                  <span className="ms-caption">{feature.title}</span>
                </div>
              </Reveal>
              <h2 className="mt-6 max-w-xl font-display text-display-lg leading-[1.05] text-ms-bone">
                <WordReveal text={feature.subtitle} />
              </h2>
              <Reveal y={16} delay={0.1} className="mt-6">
                <p className="font-mono text-body-sm text-ms-fog">
                  {feature.keySpec}
                </p>
                <Link
                  href={feature.learnMoreHref}
                  className="mt-8 inline-flex items-center gap-2 text-body-sm text-ms-ion transition-opacity hover:opacity-70"
                >
                  Learn more
                  <span aria-hidden>&rarr;</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
