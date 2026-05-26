import Link from "next/link";

import { Placeholder } from "@/components/placeholder/Placeholder";
import { features } from "@/content/features";

/**
 * Section 3 — Cinematic feature reveals. Eight full-screen panels, one per
 * feature. Phase 1 lays out the panel + a video-loop placeholder; Phase 3
 * adds Higgsfield loops + the scroll-jacked reveal choreography.
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
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <Placeholder
                label="VIDEO LOOP"
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* Copy */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-display-md leading-none text-ms-graphite">
                  {feature.index}
                </span>
                <span className="ms-caption">{feature.title}</span>
              </div>
              <h2 className="mt-6 max-w-xl text-balance font-display text-display-lg leading-[1.05] text-ms-bone">
                {feature.subtitle}
              </h2>
              <p className="mt-6 font-mono text-body-sm text-ms-fog">
                {feature.keySpec}
              </p>
              <Link
                href={feature.learnMoreHref}
                className="mt-8 inline-flex items-center gap-2 text-body-sm text-ms-ion transition-opacity hover:opacity-70"
              >
                Learn more
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
