"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
}

/**
 * Word-by-word mask reveal for headlines, triggered by IntersectionObserver.
 * Renders inline word spans (preserving the surrounding heading element), each
 * rising out of a clipped mask. Reduced-motion shows the words instantly.
 *
 * Inter-word spacing uses an em-based right margin (NOT a whitespace text node,
 * which collapses between inline-block boxes). aria-label keeps it readable to
 * assistive tech while the visible words are split.
 */
export function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { autoAlpha: 1, yPercent: 0 });
      return;
    }

    gsap.set(targets, { autoAlpha: 0, yPercent: 110 });

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.06,
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className={cn(
            "inline-block overflow-hidden pb-[0.12em] align-bottom",
            i < words.length - 1 && "mr-[0.25em]",
          )}
        >
          <span data-word className="inline-block" style={{ opacity: 0 }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
