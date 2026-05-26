import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Process" };

const steps = [
  {
    title: "Discovery call",
    body: "Meet Brandon, talk through your vision, and confirm it's a fit.",
  },
  {
    title: "Deposit",
    body: "A 50% deposit secures your build slot. We purchase the van and begin preparation.",
  },
  {
    title: "Build",
    body: "Construction over approximately two months, with predictable timelines.",
  },
  {
    title: "Inspection",
    body: "Comprehensive road trial — we triple-check every system, hunt for rattles, and verify there are no leaks.",
  },
  {
    title: "Handoff",
    body: "Pick up in San Diego, or we'll ship anywhere in the continental US.",
  },
];

export default function ProcessPage() {
  return (
    <RouteStub eyebrow="Process" title="From vision to reality.">
      <ol className="mt-12 divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-6 py-6">
            <span className="font-mono text-display-md leading-none text-ms-graphite">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-display-md leading-none text-ms-bone">
                {step.title}
              </h2>
              <p className="mt-3 max-w-xl text-body text-ms-fog">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </RouteStub>
  );
}
