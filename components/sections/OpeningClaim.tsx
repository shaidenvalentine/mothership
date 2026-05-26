/**
 * Section 2 — The opening claim. Three full-screen statements (verbatim).
 * Phase 2 adds the word-by-word reveal + per-claim background shift.
 */
const claims = [
  "3D-printed. Patented manufacturing nobody else can replicate.",
  "Fully electric. Zero compromise, infinite range with the right infrastructure.",
  "Six weeks. From order to delivery. The industry takes a year.",
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
