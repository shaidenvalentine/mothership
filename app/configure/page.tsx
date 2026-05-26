import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Reserve" };

export default function ReservePage() {
  return (
    <RouteStub
      eyebrow="Reserve"
      title="Reserve your Mothership."
      note="A 50% deposit secures your build slot — reservation flow coming soon. To start now, email brandon@bucksd.com."
    />
  );
}
