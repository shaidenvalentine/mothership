import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Section 9 — Final CTA. Reserve a build or schedule a consultation.
 */
export function FinalCta() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-ms-black px-6 text-center">
      <h2 className="max-w-4xl text-balance font-display text-display-xl leading-[1.0] text-ms-bone">
        Reserve your Mothership.
      </h2>
      <p className="mt-6 max-w-xl text-balance text-body-lg text-ms-fog">
        A 50% deposit secures your build slot. About two months from deposit to
        keys in hand.
      </p>
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
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
      </div>
    </section>
  );
}
