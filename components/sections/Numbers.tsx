/**
 * Section 5 — The numbers. 2×2 stat grid. Phase 3 adds the 0→final
 * count-up on scroll-into-view.
 */
const stats = [
  { value: "~2 mo", label: "from deposit to keys in hand" },
  { value: "1 design", label: "perfected through years of real-world experience" },
  { value: "Lower 48", label: "delivered anywhere in the continental US" },
  { value: "Up to 50%", label: "Section 179 savings for qualified buyers" },
];

export function Numbers() {
  return (
    <section className="flex min-h-screen items-center bg-ms-black px-6 py-24 lg:px-16">
      <div className="mx-auto grid w-full max-w-[120rem] grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="flex flex-col justify-between gap-12 bg-ms-black p-10 lg:p-16"
          >
            <span className="font-display text-display-2xl leading-none text-ms-bone">
              {stat.value}
            </span>
            <span className="ms-caption max-w-xs">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
