import type { Metadata } from "next";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { CalEmbed } from "@/components/forms/CalEmbed";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <Reveal y={12}>
          <span className="ms-caption">Contact</span>
        </Reveal>
        <h1 className="mt-6 max-w-3xl font-display text-display-2xl leading-[0.98] text-ms-bone">
          <WordReveal text="Book a discovery call with Shaiden." />
        </h1>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
            Grab a time that works, or send a note and we&apos;ll come to you.
            Either way, you&apos;ll be talking with Shaiden about your build.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal y={24}>
            <CalEmbed />
          </Reveal>
          <Reveal y={24} delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal y={16} delay={0.1}>
          <p className="mt-12 text-body-sm text-ms-ash">
            Prefer to reach out directly? Email brandon@bucksd.com or DM
            @mothershipvehicles on Instagram.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
