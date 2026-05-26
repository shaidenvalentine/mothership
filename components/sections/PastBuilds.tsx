import Link from "next/link";

import { Placeholder } from "@/components/placeholder/Placeholder";
import { vans } from "@/content/vans";

/**
 * Section 7 — Past builds. Editorial gallery of prior Motherships. Phase 3
 * turns this into the horizontal-scroll gallery with large imagery.
 */
export function PastBuilds() {
  return (
    <section className="bg-ms-black px-6 py-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <div className="flex items-end justify-between">
          <div>
            <span className="ms-caption">Past builds</span>
            <h2 className="mt-6 font-display text-display-lg leading-none text-ms-bone">
              Proof of capability.
            </h2>
          </div>
          <Link
            href="/vans"
            className="hidden text-body-sm text-ms-ion transition-opacity hover:opacity-70 sm:inline"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {vans.map((van) => (
            <Link key={van.slug} href={`/vans/${van.slug}`} className="group">
              <Placeholder
                accent={van.accent}
                className="aspect-[3/4] w-full transition-transform duration-500 ease-expo-out group-hover:-translate-y-1"
              />
              <div className="mt-5 flex items-baseline justify-between">
                <span className="font-display text-display-md leading-none text-ms-bone">
                  {van.number}
                </span>
                <span className="ms-caption">{van.year}</span>
              </div>
              <p className="mt-3 text-body-sm text-ms-fog">{van.platform}</p>
              <p className="mt-1 text-body-sm text-ms-ash">{van.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
