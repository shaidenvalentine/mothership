"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Fixed top navigation. Transparent over the hero, becomes solid once the
 * user scrolls past the fold. Below `lg` the centered links collapse into a
 * hamburger → slide-down menu.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-expo-out",
        solid
          ? "border-b border-ms-graphite/60 bg-ms-black/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[120rem] items-center justify-between px-6 lg:px-16">
        {/* Wordmark */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-mono text-sm tracking-[0.3em] text-ms-bone transition-opacity hover:opacity-70"
        >
          {site.wordmark}
        </Link>

        {/* Centered links (desktop) */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
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

        {/* Right cluster */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={site.primaryCta.href}
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full bg-ms-bone px-5 text-ms-black hover:bg-ms-paper",
            )}
          >
            {site.primaryCta.label}
          </Link>

          {/* Hamburger (below lg) */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "block h-px w-5 bg-ms-bone transition-transform duration-300",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-ms-bone transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-ms-bone transition-transform duration-300",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "overflow-hidden border-t border-ms-graphite/60 bg-ms-black/95 backdrop-blur-md transition-[max-height,opacity] duration-500 ease-expo-out lg:hidden",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {site.navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-body-lg text-ms-bone transition-colors hover:text-ms-ion"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
