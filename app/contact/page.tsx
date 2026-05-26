import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <RouteStub
      eyebrow="Contact"
      title="Book a call with Shaiden."
      phase="Phase 5"
    />
  );
}
