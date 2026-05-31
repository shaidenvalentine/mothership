import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";

export const metadata: Metadata = {
  title: "Tax Benefits",
  description:
    "How a Mothership can pay for part of itself — Section 179, bonus depreciation, and legitimate business use. Up to 50% in potential first-year tax savings.",
};

const benefits = [
  {
    title: "Section 179 deduction",
    body: "Section 179 lets a business deduct the full purchase price of qualifying equipment in the year it's placed in service, rather than depreciating it over many years. A Mothership used for your business can qualify — meaning a large share of the cost may be deductible up front instead of spread across a decade.",
  },
  {
    title: "Bonus depreciation",
    body: "On top of (or beyond) the Section 179 limit, bonus depreciation can let you write off an additional percentage of the cost in year one. Stacked with Section 179, the combined first-year deduction can be substantial — which is where the \"up to 50% savings\" figure comes from for many buyers.",
  },
  {
    title: "Legitimate business use",
    body: "If the van is a mobile office, a production or content vehicle, a client-facing showroom, or otherwise used in the operation of your business, that use is what unlocks these deductions. The more clearly it's a business asset, the stronger the position.",
  },
];

const steps = [
  {
    n: "01",
    title: "Confirm business use",
    body: "Establish how the van serves your business and what percentage of use is business vs. personal.",
  },
  {
    n: "02",
    title: "Place it in service this tax year",
    body: "Deductions generally apply in the year the van is delivered and put to use — timing matters.",
  },
  {
    n: "03",
    title: "Work with your CPA",
    body: "Your tax professional applies Section 179 and bonus depreciation to your specific return and limits.",
  },
];

export default function TaxBenefitsPage() {
  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <Reveal y={12}>
          <span className="ms-caption text-ms-ion">Tax benefits</span>
        </Reveal>
        <h1 className="mt-6 max-w-4xl font-display text-display-2xl leading-[0.98] text-ms-bone">
          <WordReveal text="Up to 50% in Section 179 savings." />
        </h1>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
            For the right buyer, a Mothership isn&rsquo;t only a home on wheels —
            it&rsquo;s a business asset that can pay for part of itself through
            the tax code. Here&rsquo;s how that works in plain terms.
          </p>
        </Reveal>

        {/* Benefits */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} y={20} delay={(i % 3) * 0.08} className="bg-ms-black p-10 lg:p-12">
              <h2 className="font-display text-display-md leading-tight text-ms-bone">
                {b.title}
              </h2>
              <p className="mt-4 text-body text-ms-fog">{b.body}</p>
            </Reveal>
          ))}
        </div>

        {/* How to capture it */}
        <section className="mt-24">
          <Reveal y={12}>
            <span className="ms-caption">How to capture it</span>
          </Reveal>
          <ol className="mt-10 divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-6 py-6">
                <span className="font-mono text-display-md leading-none text-ms-graphite">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-display-md leading-none text-ms-bone">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-body text-ms-fog">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Disclaimer + CTA */}
        <Reveal y={16}>
          <p className="mt-16 max-w-3xl text-body-sm text-ms-ash">
            This is general information, not tax advice. Deduction amounts,
            limits, and eligibility depend on your business, your filing
            strategy, and current law — they change year to year. Always confirm
            with a qualified tax professional before relying on any figure here.
          </p>
        </Reveal>
        <Reveal y={20}>
          <div className="mt-12 flex flex-col items-start gap-6 border-t border-ms-graphite/60 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl font-display text-display-md leading-tight text-ms-bone">
              Let&rsquo;s talk through your build.
            </p>
            <Link
              href="/contact"
              className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
            >
              Schedule a consultation
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
