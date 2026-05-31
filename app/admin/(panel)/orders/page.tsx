import Link from "next/link";

import { listDeals, listTeamMembers } from "@/lib/db/queries";
import { PIPELINE_STAGES } from "@/lib/db/schema";
import { formatCents } from "@/lib/format";
import { NewOrderButton } from "./NewOrderButton";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [deals, team] = await Promise.all([
    listDeals(),
    listTeamMembers(),
  ]);
  const ownerName = (id: number | null) =>
    id ? (team.find((m) => m.id === id)?.name ?? "—") : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="ms-caption">Sales</span>
          <h1 className="mt-2 font-display text-display-md text-ms-bone">
            Pipeline
          </h1>
          <p className="mt-2 text-sm text-ms-fog">
            Every customer from cold lead to van delivered. Open a deal to move
            its stage, set the owner, price, source and commissions.
          </p>
        </div>
        <NewOrderButton />
      </div>

      {deals.length === 0 ? (
        <p className="mt-10 rounded-xl border border-ms-graphite/60 px-5 py-10 text-center text-sm text-ms-ash">
          No deals yet. Leads enter here automatically when a reservation,
          consultation or viewing form is submitted — or add one manually.
        </p>
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const col = deals.filter((d) => d.pipelineStage === stage);
            const value = col.reduce((s, d) => s + d.totalPriceCents, 0);
            return (
              <div key={stage} className="w-64 shrink-0">
                <div className="flex items-baseline justify-between border-b border-ms-graphite/60 pb-2">
                  <span className="text-sm text-ms-bone">{stage}</span>
                  <span className="text-xs text-ms-ash">{col.length}</span>
                </div>
                {value > 0 ? (
                  <div className="mt-1 text-xs text-ms-ash">
                    {formatCents(value)}
                  </div>
                ) : null}
                <div className="mt-3 space-y-2">
                  {col.map((d) => (
                    <Link
                      key={d.id}
                      href={`/admin/orders/${d.id}`}
                      className="block rounded-lg border border-ms-graphite/50 bg-ms-obsidian p-3 transition hover:border-ms-ion/50"
                    >
                      <div className="text-sm text-ms-bone">
                        {d.customerName}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-ms-ash">
                        {d.totalPriceCents > 0 ? (
                          <span>{formatCents(d.totalPriceCents)}</span>
                        ) : null}
                        {d.source ? <span>· {d.source}</span> : null}
                        {ownerName(d.ownerId) ? (
                          <span>· {ownerName(d.ownerId)}</span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
