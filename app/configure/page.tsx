import type { Metadata } from "next";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { ConfigureExperience } from "@/components/configurator/ConfigureExperience";

export const metadata: Metadata = {
  title: "Configure",
  description:
    "Configure your Mothership — exterior finish and interior materials — then reserve your build.",
};

export default function ConfigurePage() {
  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        {/* Header */}
        <Reveal y={12}>
          <span className="ms-caption text-ms-ion">Configure</span>
        </Reveal>
        <h1 className="mt-6 max-w-2xl font-display text-display-2xl leading-[0.98] text-ms-bone">
          <WordReveal text="Make it yours." />
        </h1>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-xl text-body-lg text-ms-fog">
            Choose your exterior finish and interior materials. Your build
            carries straight through to your reservation — no fees, no
            commitment until you&rsquo;re ready.
          </p>
        </Reveal>

        <ConfigureExperience />
      </div>
    </main>
  );
}
