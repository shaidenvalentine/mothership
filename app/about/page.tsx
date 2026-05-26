import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <RouteStub
      eyebrow="About"
      title="Built in San Diego. Designed for everywhere."
      phase="Phase 6"
    />
  );
}
