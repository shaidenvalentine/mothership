import {
  dealSequenceNumbers,
  listTeamMembers,
  ordersWithCommissions,
} from "@/lib/db/queries";
import { ACTIVE_BUILD_STAGES, PIPELINE_STAGES } from "@/lib/db/schema";
import { commissionAmountCents, standardCommissions } from "@/lib/commission";
import { getDealConfig } from "@/lib/deal-config";
import { formatCents } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const [data, seqMap, dealConfig, team] = await Promise.all([
    ordersWithCommissions(),
    dealSequenceNumbers(),
    getDealConfig(),
    listTeamMembers(),
  ]);
  const ownerName = (id: number | null) =>
    id ? (team.find((m) => m.id === id)?.name ?? null) : null;

  // Per-payee earnings: realized (Delivered) vs projected (still open).
  const byPayee = new Map<
    string,
    { realized: number; projected: number; deals: Set<number> }
  >();
  // Per-source funnel.
  const bySource = new Map<
    string,
    { count: number; value: number; won: number }
  >();
  const stageCounts = new Map<string, number>();

  let totalDeals = 0;
  let wonDeals = 0;
  let lostDeals = 0;
  let pipelineValue = 0;
  let wonValue = 0;

  for (const { order, lines } of data) {
    totalDeals += 1;
    const won = order.pipelineStage === "Delivered";
    const lost = order.pipelineStage === "Lost";
    if (won) {
      wonDeals += 1;
      wonValue += order.totalPriceCents;
    }
    if (lost) lostDeals += 1;
    if (!won && !lost) pipelineValue += order.totalPriceCents;

    stageCounts.set(
      order.pipelineStage,
      (stageCounts.get(order.pipelineStage) ?? 0) + 1,
    );

    const src = order.source ?? "unknown";
    const s = bySource.get(src) ?? { count: 0, value: 0, won: 0 };
    s.count += 1;
    s.value += order.totalPriceCents;
    if (won) s.won += 1;
    bySource.set(src, s);

    if (lost) continue; // lost deals pay no commission

    const credit = (payee: string, amt: number) => {
      const e =
        byPayee.get(payee) ?? {
          realized: 0,
          projected: 0,
          deals: new Set<number>(),
        };
      e.deals.add(order.id);
      if (won) e.realized += amt;
      else e.projected += amt;
      byPayee.set(payee, e);
    };

    // Standard tiered streams — only once the deal is sold (tier locked).
    const vanNumber = seqMap.get(order.id);
    if (vanNumber) {
      for (const sc of standardCommissions(
        order,
        vanNumber,
        dealConfig.commission,
        ownerName(order.ownerId),
      )) {
        credit(sc.payee, sc.amountCents);
      }
    }

    // Manual / override lines.
    for (const c of lines) {
      credit(c.payee, commissionAmountCents(order, c));
    }
  }

  const closedTotal = wonDeals + lostDeals;
  const winRate = closedTotal > 0 ? Math.round((wonDeals / closedTotal) * 100) : 0;
  const activeBuilds = data.filter((d) =>
    ACTIVE_BUILD_STAGES.includes(d.order.pipelineStage),
  ).length;

  const payees = [...byPayee.entries()].sort(
    (a, b) =>
      b[1].realized + b[1].projected - (a[1].realized + a[1].projected),
  );
  const sources = [...bySource.entries()].sort((a, b) => b[1].count - a[1].count);

  const stats = [
    { label: "Total deals", value: String(totalDeals) },
    { label: "Active builds", value: String(activeBuilds) },
    { label: "Delivered", value: String(wonDeals) },
    { label: "Win rate", value: `${winRate}%` },
    { label: "Open pipeline value", value: formatCents(pipelineValue) },
    { label: "Delivered value", value: formatCents(wonValue) },
  ];

  return (
    <div className="max-w-4xl">
      <span className="ms-caption">Metrics</span>
      <h1 className="mt-2 font-display text-display-md text-ms-bone">
        Performance
      </h1>
      <p className="mt-2 text-sm text-ms-fog">
        Sales, commissions and conversion for Kial, Shaiden and Brandon. Realized
        = commission on delivered vans; projected = open deals still in the
        pipeline.
      </p>

      {/* KPI row */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-5"
          >
            <div className="font-display text-2xl text-ms-bone">{s.value}</div>
            <div className="mt-1 text-xs text-ms-ash">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Commission by person */}
      <section className="mt-10">
        <h2 className="font-display text-xl text-ms-bone">Commission by person</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-ms-graphite/60">
          {payees.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ms-ash">
              No commission lines recorded yet. Add them on a deal&rsquo;s page.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ms-graphite/60 text-xs uppercase tracking-wide text-ms-ash">
                <tr>
                  <th className="px-5 py-3 font-medium">Person</th>
                  <th className="px-5 py-3 font-medium">Deals</th>
                  <th className="px-5 py-3 font-medium">Realized</th>
                  <th className="px-5 py-3 font-medium">Projected</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {payees.map(([name, e]) => (
                  <tr key={name} className="border-b border-ms-graphite/30">
                    <td className="px-5 py-3 text-ms-bone">{name}</td>
                    <td className="px-5 py-3 text-ms-fog">{e.deals.size}</td>
                    <td className="px-5 py-3 text-ms-success">
                      {formatCents(e.realized)}
                    </td>
                    <td className="px-5 py-3 text-ms-warning">
                      {formatCents(e.projected)}
                    </td>
                    <td className="px-5 py-3 text-ms-bone">
                      {formatCents(e.realized + e.projected)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Funnel */}
        <section>
          <h2 className="font-display text-xl text-ms-bone">Funnel</h2>
          <div className="mt-4 space-y-1.5">
            {PIPELINE_STAGES.map((stage) => {
              const n = stageCounts.get(stage) ?? 0;
              const pct = totalDeals > 0 ? (n / totalDeals) * 100 : 0;
              return (
                <div key={stage} className="flex items-center gap-3 text-sm">
                  <span className="w-28 shrink-0 text-ms-fog">{stage}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ms-graphite/40">
                    <div
                      className="h-full bg-ms-ion"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-ms-ash">{n}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* By source */}
        <section>
          <h2 className="font-display text-xl text-ms-bone">Lead sources</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-ms-graphite/60">
            {sources.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ms-ash">
                No source data yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ms-graphite/60 text-xs uppercase tracking-wide text-ms-ash">
                  <tr>
                    <th className="px-4 py-2 font-medium">Source</th>
                    <th className="px-4 py-2 font-medium">Leads</th>
                    <th className="px-4 py-2 font-medium">Won</th>
                    <th className="px-4 py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map(([src, s]) => (
                    <tr key={src} className="border-b border-ms-graphite/30">
                      <td className="px-4 py-2 text-ms-bone">{src}</td>
                      <td className="px-4 py-2 text-ms-fog">{s.count}</td>
                      <td className="px-4 py-2 text-ms-fog">{s.won}</td>
                      <td className="px-4 py-2 text-ms-ash">
                        {formatCents(s.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
