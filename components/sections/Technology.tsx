import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";

/**
 * Section 4 — The material. Reframes 3D printing as a premium, high-tech build
 * method (carbon-fiber composite, not cheap plastic) with the engineering and
 * finish advantages that make it the right way to build a van.
 */
const benefits = [
  {
    title: "Carbon-fiber strong",
    body: "Printed from aerospace-grade carbon-fiber composite filament — not the brittle plastic you're picturing.",
  },
  {
    title: "Impossibly light",
    body: "A fraction of the weight of wood or aluminum — more range, more payload, less to haul.",
  },
  {
    title: "Waterproof & mold-resistant",
    body: "Sealed, non-porous surfaces that shrug off moisture for the entire life of the van.",
  },
  {
    title: "Channels built in",
    body: "Ducting and electrical runs are printed inside the cabinetry itself — nothing bolted on after.",
  },
  {
    title: "Organic geometry",
    body: "Flowing, ergonomic shapes that were simply impossible to build in wood or metal.",
  },
  {
    title: "Finished where it matters",
    body: "Real wood, leather, and stone layered over the structure — technology you feel, not see.",
  },
];

export function Technology() {
  return (
    <section className="bg-ms-black px-6 py-32 lg:px-16">
      <div className="mx-auto w-full max-w-[120rem]">
        <Reveal y={12}>
          <span className="ms-caption">The material</span>
        </Reveal>
        <h2 className="mt-6 max-w-4xl font-display text-display-xl leading-[1.04] text-ms-bone">
          <WordReveal text="The most advanced way to build a van." />
        </h2>
        <Reveal y={16} delay={0.1}>
          <p className="mt-8 max-w-2xl text-body-lg text-ms-fog">
            Most people hear &ldquo;3D-printed&rdquo; and picture cheap plastic.
            Ours is the opposite: aerospace-grade carbon-fiber composite, printed
            into one seamless interior — then finished in the materials you&apos;d
            expect in a five-star suite.
          </p>
        </Reveal>

        <Reveal scaleFrom={1.04} className="mt-16">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-ms-graphite/70 bg-ms-obsidian">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/render-consoles.png"
            >
              <source src="/images/tech-sizzle.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal
              key={b.title}
              y={20}
              delay={(i % 3) * 0.08}
              className="bg-ms-black p-8 lg:p-10"
            >
              <h3 className="font-display text-display-md leading-tight text-ms-bone">
                {b.title}
              </h3>
              <p className="mt-3 text-body text-ms-fog">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
