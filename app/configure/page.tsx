import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Configure" };

export default function ConfigurePage() {
  return (
    <RouteStub
      eyebrow="Configurator"
      title="Design yours. Start with a palette."
      phase="Phase 4"
    />
  );
}
