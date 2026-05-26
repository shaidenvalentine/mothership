import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <RouteStub
      eyebrow="Process"
      title="From order to delivery in six weeks."
      phase="Phase 6"
    />
  );
}
