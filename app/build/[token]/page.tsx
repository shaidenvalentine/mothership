import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  amountPaidCents,
  getOrderByToken,
  listBuildUpdates,
} from "@/lib/db/queries";
import { BUILD_STAGES } from "@/lib/db/schema";
import { formatCents, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your build",
  robots: { index: false, follow: false },
};

export default async function BuildTrackerPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  const [updates, paid] = await Promise.all([
    listBuildUpdates(order.id, { visibleOnly: true }),
    amountPaidCents(order.id),
  ]);

  const stageIndex = BUILD_STAGES.indexOf(order.buildStage);
  const balance = order.totalPriceCents - paid;

  return (
    <main className="min-h-screen bg-ms-black px-6 py-16 text-ms-bone lg:px-0">
      <div className="mx-auto max-w-3xl">
        <span className="ms-caption">Mothership · Build tracker</span>
        <h1 className="mt-3 font-display text-display-lg leading-[1] text-ms-bone">
          {order.customerName.split(" ")[0]}&rsquo;s Mothership
        </h1>
        <p className="mt-3 text-body text-ms-fog">
          Follow your build from reservation to keys in hand. This page updates
          as we go.
        </p>

        {/* Stage progress */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <span className="ms-caption">Current stage</span>
            <span className="text-sm text-ms-ion">{order.buildStage}</span>
          </div>
          <div className="mt-4 space-y-2">
            {BUILD_STAGES.map((stage, i) => {
              const done = i < stageIndex;
              const current = i === stageIndex;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      done && "bg-ms-success",
                      current && "bg-ms-ion ring-4 ring-ms-ion/20",
                      !done && !current && "bg-ms-graphite",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      current
                        ? "text-ms-bone"
                        : done
                          ? "text-ms-fog"
                          : "text-ms-ash",
                    )}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment summary */}
        {order.totalPriceCents > 0 ? (
          <section className="mt-12 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <span className="ms-caption">Payment summary</span>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ms-ash">Build total</dt>
                <dd>{formatCents(order.totalPriceCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ms-ash">Paid to date</dt>
                <dd className="text-ms-success">{formatCents(paid)}</dd>
              </div>
              <div className="flex justify-between border-t border-ms-graphite/40 pt-2">
                <dt className="text-ms-ash">Remaining balance</dt>
                <dd className={balance > 0 ? "text-ms-warning" : "text-ms-success"}>
                  {formatCents(Math.max(0, balance))}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        {/* Timeline */}
        <section className="mt-12">
          <span className="ms-caption">Timeline</span>
          {updates.length === 0 ? (
            <p className="mt-4 text-sm text-ms-ash">
              No updates yet — we&rsquo;ll post the first one soon.
            </p>
          ) : (
            <div className="mt-6 space-y-10 border-l border-ms-graphite/60 pl-6">
              {updates.map((u) => (
                <article key={u.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-ms-ion" />
                  <p className="text-xs text-ms-ash">
                    {formatDate(u.createdAt)}
                    {u.stage ? ` · ${u.stage}` : ""}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ms-bone">
                    {u.title}
                  </h3>
                  {u.body ? (
                    <p className="mt-2 whitespace-pre-wrap text-body text-ms-fog">
                      {u.body}
                    </p>
                  ) : null}
                  {u.photos.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {u.photos.map((p) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={p}
                          src={p}
                          alt=""
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 border-t border-ms-graphite/40 pt-6 text-xs text-ms-ash">
          Questions about your build? Reply to any of our emails or reach us at{" "}
          <a href="mailto:brandon@bucksd.com" className="text-ms-fog hover:text-ms-bone">
            brandon@bucksd.com
          </a>
          .
        </footer>
      </div>
    </main>
  );
}
