import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Placeholder } from "@/components/placeholder/Placeholder";
import { configOptions } from "@/content/config-options";
import { cn } from "@/lib/utils";

/**
 * Section 6 — Configurator teaser. Half-screen split: van shifting through
 * interior palettes (left) + copy & CTA (right). Phase 4 wires the live 3D.
 */
export function ConfiguratorTeaser() {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: palette preview */}
      <div className="relative flex items-center justify-center bg-ms-obsidian p-10 lg:p-16">
        <Placeholder label="PALETTE PREVIEW" className="aspect-square w-full max-w-xl" />
        <div className="absolute bottom-10 left-10 flex gap-3 lg:left-16">
          {configOptions.interiorPalettes.map((palette) => (
            <span
              key={palette.id}
              title={palette.name}
              className="size-6 rounded-full border border-ms-graphite"
              style={{ backgroundColor: palette.swatch }}
            />
          ))}
        </div>
      </div>

      {/* Right: copy */}
      <div className="flex items-center bg-ms-black px-6 py-24 lg:px-16">
        <div className="max-w-md">
          <span className="ms-caption">Configurator</span>
          <h2 className="mt-6 text-balance font-display text-display-lg leading-[1.05] text-ms-bone">
            Design yours. Start with a palette.
          </h2>
          <Link
            href="/configure"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-10 rounded-full bg-ms-bone px-7 text-ms-black hover:bg-ms-paper",
            )}
          >
            Configure Your Mothership
          </Link>
        </div>
      </div>
    </section>
  );
}
