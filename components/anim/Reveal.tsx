"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Upward travel distance in px. */
  y?: number;
  /** Stagger offset when several reveals fire together. */
  delay?: number;
  /** Subtle scale-down settle (good for media). */
  scaleFrom?: number;
}

/**
 * Fade + rise into view, triggered by IntersectionObserver (robust regardless
 * of the scroll mechanism). Hidden by default; reduced-motion reveals instantly.
 */
export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  scaleFrom,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    gsap.set(el, { autoAlpha: 0, y, ...(scaleFrom ? { scale: scaleFrom } : {}) });

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              delay,
            });
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [y, delay, scaleFrom]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
