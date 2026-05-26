import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Tax Benefits" };

const benefits = [
  {
    title: "Section 179 deduction",
    body: "Deduct the cost of qualifying equipment up front.",
  },
  {
    title: "Bonus depreciation",
    body: "Additional first-year write-off alongside Section 179.",
  },
  {
    title: "Business use",
    body: "Mobile office, production, client meetings — a strategic asset.",
  },
];

export default function TaxBenefitsPage() {
  return (
    <RouteStub
      eyebrow="Tax benefits"
      title="Up to 50% in Section 179 savings."
      note="Eligibility depends on your business use and filing strategy — always consult a qualified tax professional."
    >
      <ul className="mt-12 divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
        {benefits.map((b) => (
          <li key={b.title} className="py-6">
            <h2 className="font-display text-display-md leading-none text-ms-bone">
              {b.title}
            </h2>
            <p className="mt-3 max-w-xl text-body text-ms-fog">{b.body}</p>
          </li>
        ))}
      </ul>
    </RouteStub>
  );
}
