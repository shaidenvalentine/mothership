import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Minimal footer: wordmark + newsletter, 4 link columns, socials, address.
 * Newsletter is a non-wired placeholder (real Resend double opt-in in Phase 5).
 */
export function Footer() {
  return (
    <footer className="border-t border-ms-graphite/60 bg-ms-black">
      <div className="mx-auto max-w-[120rem] px-6 py-20 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-mono text-sm tracking-[0.3em] text-ms-bone"
            >
              {site.wordmark}
            </Link>
            <p className="mt-4 text-body-sm text-ms-ash">{site.tagline}</p>

            <form className="mt-8 flex max-w-xs items-center gap-2">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                aria-label="Email address"
                className="h-9 w-full rounded-md border border-ms-graphite bg-ms-obsidian px-3 text-body-sm text-ms-bone placeholder:text-ms-ash focus:border-ms-ion focus:outline-none"
              />
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "shrink-0 border-ms-graphite text-ms-bone hover:bg-ms-obsidian",
                )}
              >
                Join
              </button>
            </form>
          </div>

          {/* Link columns */}
          {site.footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="ms-caption">{column.heading}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-ms-fog transition-colors hover:text-ms-bone"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Baseline */}
        <div className="mt-16 flex flex-col gap-2 border-t border-ms-graphite/40 pt-8 text-caption text-ms-ash sm:flex-row sm:items-center sm:justify-between">
          <span>{site.address}</span>
          <span>{site.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
