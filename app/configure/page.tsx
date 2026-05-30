import type { Metadata } from "next";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { ReserveForm } from "@/components/forms/ReserveForm";

export const metadata: Metadata = { title: "Reserve" };

const steps = [
  "A 50% deposit secures your build slot.",
  "We purchase the van and begin your build.",
  "About two months from deposit to keys in hand.",
];

export default function ReservePage() {
  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto grid max-w-[120rem] grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left — pitch */}
        <div>
          <Reveal y={12}>
            <span className="ms-caption">Reserve</span>
          </Reveal>
          <h1 className="mt-6 max-w-xl font-display text-display-2xl leading-[0.98] text-ms-bone">
            <WordReveal text="Reserve your Mothership." />
          </h1>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-md text-body-lg text-ms-fog">
              Start the build of the all-electric, self-charging camper van of
              the future. Tell us a little about you and Shaiden will set up your
              discovery call.
            </p>
          </Reveal>

          <Reveal y={16} delay={0.15}>
            <ol className="mt-10 space-y-4 border-t border-ms-graphite/60 pt-8">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4 text-body text-ms-fog">
                  <span className="font-mono text-ms-graphite">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* Right — form */}
        <Reveal y={24} delay={0.1}>
          <ReserveForm />
        </Reveal>
      </div>
    </main>
  );
}
