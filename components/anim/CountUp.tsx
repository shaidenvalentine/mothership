"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CountUpProps {
  /** Target number to count to. */
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts 0 → value when scrolled into view (IntersectionObserver), preserving
 * any prefix/suffix around the number. Reduced-motion shows the value instantly.
 */
export function CountUp({ value, prefix = "", suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (n: number) => {
      el.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(value);
      return;
    }

    render(0);
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const counter = { n: 0 };
            gsap.to(counter, {
              n: value,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => render(counter.n),
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>{`${prefix}0${suffix}`}</span>
  );
}
