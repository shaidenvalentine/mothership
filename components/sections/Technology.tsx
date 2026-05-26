import { Placeholder } from "@/components/placeholder/Placeholder";

/**
 * Section 4 — Technology. Tron-style wireframe reveal of the printed interior.
 * Phase 1 = static placeholder + the five callouts (verbatim). Phase 3 adds
 * the fly-in 3D pieces.
 */
const callouts = [
  "Patent-pending interior architecture",
  "Generative-design ribbing — strength without weight",
  "Zero-fastener assembly — interior parts snap together",
  "Modular layout — reconfigurable in under a day",
  "$140K build cost — the math nobody else can hit",
];

export function Technology() {
  return (
    <section className="relative flex min-h-screen items-center bg-ms-black px-6 py-24 lg:px-16">
      <div className="mx-auto w-full max-w-[120rem]">
        <span className="ms-caption">Technology</span>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-display-xl leading-[1.05] text-ms-bone">
          Impossible to replicate.
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Placeholder
            label="WIREFRAME VAN"
            accent="var(--color-ms-ion)"
            className="aspect-[16/10] w-full"
          />
          <ul className="divide-y divide-ms-graphite/60 border-y border-ms-graphite/60">
            {callouts.map((callout) => (
              <li
                key={callout}
                className="py-5 text-body-lg text-ms-fog"
              >
                {callout}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
