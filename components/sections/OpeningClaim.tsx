/**
 * Section 2 — The opening claim. Three full-screen statements (verbatim).
 * Phase 2 adds the word-by-word reveal + per-claim background shift.
 */
const claims = [
  "Mercedes Sprinter, reimagined with a proprietary 3D-printed interior.",
  "One design, perfected through years of real-world experience.",
  "Built by hand in San Diego. Delivered anywhere in the continental US.",
];

export function OpeningClaim() {
  return (
    <section className="bg-ms-black">
      {claims.map((claim, i) => (
        <div
          key={claim}
          className="flex min-h-screen items-center justify-center px-6 lg:px-16"
        >
          <div className="mx-auto max-w-5xl">
            <span className="ms-caption">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-6 text-balance font-display text-display-xl leading-[1.05] text-ms-bone">
              {claim}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
