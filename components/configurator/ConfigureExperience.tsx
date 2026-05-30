"use client";

import { useState } from "react";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Configurator } from "@/components/configurator/Configurator";
import { ReserveForm } from "@/components/forms/ReserveForm";
import { defaultSelections, buildSpecLines } from "@/content/configurator";

const steps = [
  "A 50% deposit secures your build slot.",
  "We purchase the van and begin your build.",
  "About two months from deposit to keys in hand.",
];

export function ConfigureExperience() {
  const [specLines, setSpecLines] = useState<string[]>(() =>
    buildSpecLines(defaultSelections()),
  );

  return (
    <div className="mt-16 space-y-24">
      {/* Configurator */}
      <Reveal y={20}>
        <Configurator onConfigChange={setSpecLines} reserveTargetId="reserve" />
      </Reveal>

      {/* Reserve */}
      <div
        id="reserve"
        className="grid grid-cols-1 gap-16 border-t border-ms-graphite/60 pt-20 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <Reveal y={12}>
            <span className="ms-caption">Reserve</span>
          </Reveal>
          <h2 className="mt-6 max-w-xl font-display text-display-xl leading-[0.98] text-ms-bone">
            <WordReveal text="Lock in your build." />
          </h2>
          <Reveal y={16} delay={0.1}>
            <p className="mt-8 max-w-md text-body-lg text-ms-fog">
              Your configuration carries through with your reservation. Tell us a
              little about you and Shaiden will set up your discovery call.
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

        <Reveal y={24} delay={0.1}>
          <ReserveForm presetMessage={specLines.join("\n")} />
        </Reveal>
      </div>
    </div>
  );
}
