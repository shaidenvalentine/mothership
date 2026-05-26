import Link from "next/link";

import { Reveal } from "@/components/anim/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { Media } from "@/components/media/Media";
import { cn } from "@/lib/utils";

/**
 * Section 6 — Reserve. Half-screen split: the interior (left) + the reservation
 * path (right). A 50% deposit secures the build slot (bucksd.com process).
 */
export function ConfiguratorTeaser() {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: interior */}
      <div className="relative flex items-center justify-center bg-ms-obsidian p-10 lg:p-16">
        <Reveal scaleFrom={1.06} className="w-full max-w-xl">
          <Media
            src="/images/render-bed.jpg"
            alt="Mothership 3D-printed interior"
            className="aspect-square w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
      </div>

      {/* Right: copy */}
      <div className="flex items-center bg-ms-black px-6 py-24 lg:px-16">
        <Reveal className="max-w-md">
          <span className="ms-caption">Reserve</span>
          <h2 className="mt-6 text-balance font-display text-display-lg leading-[1.05] text-ms-bone">
            Reserve your Mothership.
          </h2>
          <p className="mt-6 text-body-lg text-ms-fog">
            A 50% deposit secures your build slot. We purchase the van and begin
            your build — about two months from deposit to keys.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
        </Reveal>
      </div>
    </section>
  );
}
