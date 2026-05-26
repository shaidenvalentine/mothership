import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Technology" };

export default function TechnologyPage() {
  return (
    <RouteStub
      eyebrow="Technology"
      title="Impossible to replicate."
      phase="Phase 6"
    />
  );
}
