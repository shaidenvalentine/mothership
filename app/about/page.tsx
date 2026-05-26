import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <RouteStub
      eyebrow="About"
      title="The obsession behind every build."
      note="Built by Brandon Buckley in San Diego — full story coming soon."
    />
  );
}
