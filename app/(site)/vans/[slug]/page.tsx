import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { Media } from "@/components/media/Media";
import { getVanBySlug, vanSpecs, vans } from "@/content/vans";

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
  if (!van) return { title: "Vehicle" };
  return {
    title: van.title,
    description: van.description ?? van.blurb,
  };
}

export default async function VanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const van = getVanBySlug(slug);
  if (!van) notFound();

  const gallery = van.gallery ?? [van.image];
  const others = vans.filter((v) => v.slug !== van.slug);

  return (
    <main className="bg-ms-black px-6 pt-40 pb-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <Link
          href="/vans"
          className="ms-caption text-ms-ash transition-colors hover:text-ms-bone"
        >
          ← The gallery
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="ms-caption text-ms-ion">{van.platform}</span>
            <h1 className="mt-4 font-display text-display-2xl leading-[0.98] text-ms-bone">
              <WordReveal text={van.title} />
            </h1>
          </div>
          {van.description ? (
            <Reveal y={16}>
              <p className="max-w-xl text-body-lg text-ms-fog">
                {van.description}
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* Hero image */}
        <Reveal y={24} scaleFrom={1.03}>
          <Media
            src={gallery[0]}
            alt={`${van.title} — ${van.platform}`}
            className="mt-12 aspect-[16/9] w-full"
            sizes="100vw"
            priority
          />
        </Reveal>

        {/* Gallery */}
        {gallery.length > 1 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {gallery.slice(1).map((src, i) => (
              <Reveal key={src} scaleFrom={1.04} delay={(i % 2) * 0.08}>
                <Media
                  src={src}
                  alt={`${van.title} — detail ${i + 1}`}
                  className="aspect-[4/3] w-full"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        ) : null}

        {/* Specs */}
        <section className="mt-20">
          <Reveal y={12}>
            <span className="ms-caption">Specifications</span>
          </Reveal>
          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 sm:grid-cols-2 lg:grid-cols-3">
            {vanSpecs.map((spec) => (
              <div key={spec.label} className="bg-ms-black p-8">
                <dt className="ms-caption text-ms-ash">{spec.label}</dt>
                <dd className="mt-2 text-body-lg text-ms-bone">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Explore other spaces */}
        <section className="mt-20">
          <Reveal y={12}>
            <span className="ms-caption text-ms-ion">Keep exploring</span>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {others.map((v) => (
              <Link key={v.slug} href={`/vans/${v.slug}`} className="group block">
                <Media
                  src={v.image}
                  alt={v.title}
                  className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.01]"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <p className="mt-3 font-display text-body-lg text-ms-bone">
                  {v.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Reveal y={20}>
          <div className="mt-24 flex flex-col items-start gap-6 border-t border-ms-graphite/60 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl font-display text-display-md leading-tight text-ms-bone">
              One design. Built for you.
            </p>
            <Link
              href="/configure"
              className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
            >
              Reserve your Mothership
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
