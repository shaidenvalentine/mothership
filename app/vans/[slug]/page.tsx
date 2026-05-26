import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Placeholder } from "@/components/placeholder/Placeholder";
import { RouteStub } from "@/components/placeholder/RouteStub";
import { getVanBySlug, vans } from "@/content/vans";

export function generateStaticParams() {
  return vans.map((van) => ({ slug: van.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const van = getVanBySlug(slug);
  return { title: van ? van.title : "Vehicle" };
}

export default async function VanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const van = getVanBySlug(slug);

  if (!van) {
    notFound();
  }

  return (
    <RouteStub eyebrow={`Build ${van.number}`} title={van.title} phase="Phase 6">
      <p className="mt-4 text-body-lg text-ms-fog">
        {van.platform} &middot; {van.year}
      </p>
      <p className="mt-2 max-w-xl text-body text-ms-ash">{van.blurb}</p>
      <Placeholder
        accent={van.accent}
        label="GALLERY"
        className="mt-12 aspect-[16/9] w-full"
      />
    </RouteStub>
  );
}
