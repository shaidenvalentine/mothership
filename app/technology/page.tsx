import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "The Build" };

export default function TheBuildPage() {
  return (
    <RouteStub
      eyebrow="The build"
      title="A proprietary 3D-printed interior."
      note="The full build story is coming soon."
    />
  );
}
