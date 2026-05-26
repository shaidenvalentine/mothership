"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Fixed top navigation. Transparent over the hero, becomes solid once the
 * user scrolls past the fold. (A simple state toggle — scroll-scrubbed
 * choreography lands in Phase 2.)
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-expo-out",
        scrolled
          ? "border-b border-ms-graphite/60 bg-ms-black/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[120rem] items-center justify-between px-6 lg:px-16">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.3em] text-ms-bone transition-opacity hover:opacity-70"
        >
          {site.wordmark}
        </Link>

        {/* Centered links */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {site.navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body-sm text-ms-fog transition-colors hover:text-ms-bone"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={site.primaryCta.href}
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-ms-bone px-5 text-ms-black hover:bg-ms-paper",
          )}
        >
          {site.primaryCta.label}
        </Link>
      </nav>
    </header>
  );
}
