"use client";

import type { ReactNode } from "react";

/**
 * Lenis smooth-scroll provider — STUB for Phase 1.
 *
 * Phase 2 wires up Lenis (lerp 0.08, disabled on mobile) and syncs it to
 * GSAP ScrollTrigger. For now this just passes children through so the
 * provider boundary already exists in the tree.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
