import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Section 10 — Final CTA. Reserve a build or schedule a consultation.
 */
export function FinalCta() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Image
        src="/images/hero-exterior-sunset.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ms-black/85 via-ms-black/70 to-ms-black"
      />
      <h2 className="relative z-10 max-w-4xl font-display text-display-xl leading-[1.0] text-ms-bone drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
        <WordReveal text="Reserve your Mothership." />
      </h2>
      <Reveal y={20} delay={0.15} className="relative z-10">
        <p className="mx-auto mt-6 max-w-xl text-balance text-body-lg text-ms-fog">
          A 50% deposit secures your build slot. About two months from deposit
          to keys in hand.
        </p>
      </Reveal>
      <Reveal y={20} delay={0.25} className="relative z-10 mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/configure"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full bg-ms-bone px-7 text-ms-black hover:bg-ms-paper",
          )}
        >
          Reserve Your Build
        </Link>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "rounded-full border-ms-graphite px-7 text-ms-bone hover:bg-ms-obsidian",
          )}
        >
          Schedule a Consultation
        </Link>
      </Reveal>
    </section>
  );
}
