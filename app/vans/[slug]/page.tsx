import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Media } from "@/components/media/Media";
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
    <RouteStub
      eyebrow="The gallery"
      title={van.title}
      note="Full gallery coming soon."
    >
      <p className="mt-4 text-body-lg text-ms-fog">{van.platform}</p>
      <p className="mt-2 max-w-xl text-body text-ms-ash">{van.blurb}</p>
      <Media
        src={van.image}
        alt={`${van.title} — ${van.platform}`}
        className="mt-12 aspect-[16/9] w-full"
        sizes="100vw"
      />
    </RouteStub>
  );
}
