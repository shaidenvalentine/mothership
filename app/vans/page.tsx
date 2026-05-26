import type { Metadata } from "next";
import Link from "next/link";

import { RouteStub } from "@/components/placeholder/RouteStub";
import { vans } from "@/content/vans";

export const metadata: Metadata = { title: "Vehicles" };

export default function VansPage() {
  return (
    <RouteStub eyebrow="Past builds" title="Proof of capability." phase="Phase 6">
      <ul className="mt-12 divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
        {vans.map((van) => (
          <li key={van.slug}>
            <Link
              href={`/vans/${van.slug}`}
              className="flex items-baseline justify-between py-5 text-ms-fog transition-colors hover:text-ms-bone"
            >
              <span className="font-display text-display-md leading-none text-ms-bone">
                {van.number}
              </span>
              <span className="text-body-sm">{van.platform}</span>
              <span className="ms-caption">{van.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </RouteStub>
  );
}
