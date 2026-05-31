import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  amountPaidCents,
  dealSequenceNumbers,
  getOrder,
  listBuildUpdates,
  listCommissions,
  listPayments,
  listTeamMembers,
} from "@/lib/db/queries";
import { standardCommissions } from "@/lib/commission";
import { getDealConfig } from "@/lib/deal-config";
import { formatCents, formatDate, formatDateTime } from "@/lib/format";
import { Badge, PIPELINE_STAGE_TONE } from "../../_components/badges";
import { SubmitButton } from "../../_components/SubmitButton";
import {
  recordPayment,
  removeUpdate,
  saveConfiguration,
  saveOrderDetails,
} from "../actions";
import { BuildUpdateForm } from "./BuildUpdateForm";
import { CommissionsEditor } from "./CommissionsEditor";
import { OrderControls } from "./OrderControls";
import { PipelineSourcedToggle } from "./PipelineSourcedToggle";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);
  const order = await getOrder(orderId);
  if (!order) notFound();

  const [payments, paid, updates, commissionLines, team, dealConfig, seqMap] =
    await Promise.all([
      listPayments(orderId),
      amountPaidCents(orderId),
      listBuildUpdates(orderId),
      listCommissions(orderId),
      listTeamMembers({ activeOnly: true }),
      getDealConfig(),
      dealSequenceNumbers(),
    ]);

  const balance = order.totalPriceCents - paid;
  const config = (order.config ?? {}) as {
    model?: string;
    notes?: string;
    timeline?: string;
    useCase?: string;
    addOns?: Array<{ name: string; priceCents: number }>;
  };

  // Auto-computed standard commissions (closing + setting + royalty).
  const ownerName = order.ownerId
    ? (team.find((m) => m.id === order.ownerId)?.name ?? null)
    : null;
  const vanNumber = seqMap.get(order.id);
  const provisionalVan = vanNumber ?? seqMap.size + 1;
  const std = standardCommissions(
    order,
    provisionalVan,
    dealConfig.commission,
    ownerName,
  );
  const stdTotal = std.reduce((s, c) => s + c.amountCents, 0);
  const selectedAddOns = config.addOns ?? [];

  const saveConfig = saveConfiguration.bind(null, orderId);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const trackerUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`) +
    `/build/${order.trackerToken}`;

  const saveDetails = saveOrderDetails.bind(null, orderId);
  const addPaymentAction = recordPayment.bind(null, orderId);

  return (
    <div className="max-w-5xl">
      <Link
        href="/admin/orders"
        className="text-sm text-ms-ash transition hover:text-ms-bone"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-display-md text-ms-bone">
          {order.customerName}
        </h1>
        <Badge tone={PIPELINE_STAGE_TONE[order.pipelineStage]}>
          {order.pipelineStage}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-ms-ash">
        Deal #{order.id} · created {formatDate(order.createdAt)}
        {order.source ? ` · via ${order.source}` : ""}
        {order.lostReason ? ` · lost: ${order.lostReason}` : ""}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Details */}
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Customer & build</h2>
            <form action={saveDetails} className="mt-4 grid grid-cols-2 gap-4">
              <Field name="customerName" label="Name" defaultValue={order.customerName} />
              <Field name="customerEmail" label="Email" defaultValue={order.customerEmail} />
              <Field name="customerPhone" label="Phone" defaultValue={order.customerPhone ?? ""} />
              <Field name="model" label="Model / config" defaultValue={config.model ?? ""} />
              <Field name="totalPrice" label="Sale price ($)" defaultValue={(order.totalPriceCents / 100).toString()} />
              <Field name="cost" label="Build cost ($)" defaultValue={(order.costCents / 100).toString()} />
              <Field name="deposit" label="Deposit ($)" defaultValue={(order.depositCents / 100).toString()} />
              <Field name="source" label="Lead source" defaultValue={order.source ?? ""} />
              <div>
                <label className="text-xs text-ms-ash">Owner</label>
                <select
                  name="ownerId"
                  defaultValue={order.ownerId ? String(order.ownerId) : ""}
                  className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
                >
                  <option value="">Unassigned</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-ms-ash">Build notes</label>
                <textarea
                  name="configNotes"
                  rows={2}
                  defaultValue={config.notes ?? ""}
                  className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
                />
              </div>
              <div className="col-span-2">
                <SubmitButton>Save details</SubmitButton>
              </div>
            </form>
            {config.useCase || config.timeline ? (
              <p className="mt-4 text-xs text-ms-ash">
                From application — timeline: {config.timeline || "—"}; use case:{" "}
                {config.useCase || "—"}
              </p>
            ) : null}
          </section>

          {/* Configuration — SKU + add-ons (sets price & cost) */}
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Configuration</h2>
            <p className="mt-1 text-xs text-ms-ash">
              Pick the SKU and add-ons — this sets the sale price and build cost
              automatically (still editable above).
            </p>
            <form action={saveConfig} className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-ms-ash">Model</label>
                <select
                  name="skuCode"
                  defaultValue={order.skuCode ?? ""}
                  className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
                >
                  <option value="">— Select —</option>
                  {dealConfig.skus.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} — {formatCents(s.priceCents)}
                    </option>
                  ))}
                </select>
              </div>
              {dealConfig.addOns.length > 0 ? (
                <div>
                  <span className="text-xs text-ms-ash">Add-ons</span>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {dealConfig.addOns.map((a) => (
                      <label
                        key={a.name}
                        className="flex items-center gap-2 text-sm text-ms-fog"
                      >
                        <input
                          type="checkbox"
                          name="addon"
                          value={a.name}
                          defaultChecked={selectedAddOns.some(
                            (s) => s.name === a.name,
                          )}
                        />
                        {a.name} — {formatCents(a.priceCents)}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ms-ash">
                  No add-on menu configured yet (Brandon to finalize — add them
                  in Settings).
                </p>
              )}
              <SubmitButton>Apply configuration</SubmitButton>
            </form>
          </section>

          {/* Build tracker */}
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Build tracker</h2>
            <p className="mt-1 text-xs text-ms-ash">
              Post updates with photos. Customer-visible entries show on their
              tracker page.
            </p>
            <div className="mt-4">
              <BuildUpdateForm orderId={orderId} />
            </div>

            <div className="mt-8 space-y-4">
              {updates.length === 0 ? (
                <p className="text-sm text-ms-ash">No updates yet.</p>
              ) : (
                updates.map((u) => {
                  const del = removeUpdate.bind(null, orderId, u.id);
                  return (
                    <div
                      key={u.id}
                      className="rounded-lg border border-ms-graphite/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-ms-bone">{u.title}</p>
                          <p className="text-xs text-ms-ash">
                            {formatDateTime(u.createdAt)}
                            {u.stage ? ` · ${u.stage}` : ""}
                            {u.visibleToCustomer ? "" : " · hidden"}
                          </p>
                        </div>
                        <form action={del}>
                          <SubmitButton
                            variant="link"
                            confirm="Delete this build update? This can't be undone."
                            pendingLabel="Deleting…"
                          >
                            Delete
                          </SubmitButton>
                        </form>
                      </div>
                      {u.body ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-ms-fog">
                          {u.body}
                        </p>
                      ) : null}
                      {u.photos.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {u.photos.map((p) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={p}
                              src={p}
                              alt=""
                              className="h-20 w-20 rounded-md object-cover"
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Controls</h2>
            <div className="mt-4">
              <OrderControls
                id={order.id}
                pipelineStage={order.pipelineStage}
                stage={order.buildStage}
                trackerUrl={trackerUrl}
              />
            </div>
          </section>

          {/* Commissions */}
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Commissions</h2>

            {/* Auto-computed standard streams (deal rules) */}
            <div className="mt-4 rounded-md border border-ms-graphite/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-ms-ash">
                  Standard (deal rules)
                </span>
                <span className="text-xs text-ms-ash">
                  Van #{provisionalVan}
                  {vanNumber ? " this year" : " (projected)"}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {std.map((c) => (
                  <li key={c.stream} className="flex justify-between">
                    <span className="text-ms-fog">
                      {c.payee}
                      <span className="ml-2 text-xs capitalize text-ms-ash">
                        {c.stream} · {c.pct}%
                      </span>
                    </span>
                    <span className="text-ms-success">
                      {formatCents(c.amountCents)}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-ms-graphite/40 pt-1.5">
                  <span className="text-ms-ash">Standard total</span>
                  <span className="text-ms-bone">{formatCents(stdTotal)}</span>
                </li>
              </ul>
              <div className="mt-3 border-t border-ms-graphite/40 pt-3">
                <PipelineSourcedToggle
                  orderId={order.id}
                  value={order.pipelineSourced}
                />
              </div>
              {!order.soldAt ? (
                <p className="mt-2 text-xs text-ms-ash">
                  Tier locks (and these become payable) once the deal reaches
                  Deposit paid.
                </p>
              ) : null}
            </div>

            {/* Manual / override lines */}
            <p className="mt-4 text-xs text-ms-ash">
              Additional or override lines (bonuses, custom splits):
            </p>
            <div className="mt-2">
              <CommissionsEditor
                orderId={order.id}
                totalPriceCents={order.totalPriceCents}
                costCents={order.costCents}
                lines={commissionLines}
                team={team}
              />
            </div>
          </section>

          {/* Payments */}
          <section className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
            <h2 className="font-display text-xl text-ms-bone">Payments</h2>
            <dl className="mt-4 space-y-1 text-sm">
              <Row label="Total" value={formatCents(order.totalPriceCents)} />
              <Row label="Deposit due" value={formatCents(order.depositCents)} />
              <Row label="Paid" value={formatCents(paid)} tone="green" />
              <Row
                label="Balance"
                value={formatCents(balance)}
                tone={balance > 0 ? "amber" : "green"}
              />
            </dl>

            <form action={addPaymentAction} className="mt-5 space-y-3">
              <Field name="amount" label="Record payment ($)" defaultValue="" />
              <div>
                <label className="text-xs text-ms-ash">Method</label>
                <select
                  name="method"
                  className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
                >
                  <option value="manual">Manual</option>
                  <option value="wire">Wire / ACH</option>
                  <option value="card">Card</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <Field name="note" label="Note (optional)" defaultValue="" />
              <SubmitButton className="w-full" pendingLabel="Recording…">
                Add payment
              </SubmitButton>
            </form>

            {payments.length > 0 ? (
              <ul className="mt-5 space-y-2 border-t border-ms-graphite/40 pt-4 text-xs">
                {payments.map((p) => (
                  <li key={p.id} className="flex justify-between text-ms-fog">
                    <span>
                      {formatDate(p.paidAt)} · {p.method}
                      {p.note ? ` · ${p.note}` : ""}
                    </span>
                    <span className="text-ms-bone">
                      {formatCents(p.amountCents)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="text-xs text-ms-ash">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
      />
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "amber";
}) {
  const color =
    tone === "green"
      ? "text-ms-success"
      : tone === "amber"
        ? "text-ms-warning"
        : "text-ms-bone";
  return (
    <div className="flex justify-between">
      <dt className="text-ms-ash">{label}</dt>
      <dd className={color}>{value}</dd>
    </div>
  );
}
