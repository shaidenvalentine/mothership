"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WordRevealProps {
  text: string;
  className?: string;
}

/**
 * Word-by-word mask reveal for headlines, triggered by IntersectionObserver.
 * Renders inline word spans (preserving the surrounding heading element), each
 * rising out of a clipped mask. Reduced-motion shows the words instantly.
 *
 * Spaces are real text nodes BETWEEN the inline-block word masks so the words
 * don't run together (trailing whitespace inside an inline-block collapses).
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
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className="inline-block" style={{ opacity: 0 }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
