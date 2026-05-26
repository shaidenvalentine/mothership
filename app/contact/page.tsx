import type { Metadata } from "next";

import { RouteStub } from "@/components/placeholder/RouteStub";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <RouteStub
      eyebrow="Contact"
      title="Schedule a consultation."
      note="Email brandon@bucksd.com or DM @bucksd on Instagram. Booking flow coming soon."
    />
  );
}
