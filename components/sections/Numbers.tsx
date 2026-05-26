import { CountUp } from "@/components/anim/CountUp";

/**
 * Section 5 — The numbers. 2×2 stat grid; each figure counts up from 0 when it
 * scrolls into view.
 */
const stats = [
  { prefix: "~", value: 2, suffix: " mo", label: "from deposit to keys in hand" },
  {
    prefix: "",
    value: 1,
    suffix: " design",
    label: "perfected through years of real-world experience",
  },
  {
    prefix: "Lower ",
    value: 48,
    suffix: "",
    label: "delivered anywhere in the continental US",
  },
  {
    prefix: "Up to ",
    value: 50,
    suffix: "%",
    label: "Section 179 savings for qualified buyers",
  },
];

export function Numbers() {
  return (
    <section className="flex min-h-screen items-center bg-ms-black px-6 py-24 lg:px-16">
      <div className="mx-auto grid w-full max-w-[120rem] grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between gap-12 bg-ms-black p-10 lg:p-16"
          >
            <CountUp
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              className="font-display text-display-2xl leading-none text-ms-bone"
            />
            <span className="ms-caption max-w-xs">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
