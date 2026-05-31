import type {
  CommissionConfig,
  CommissionTier,
} from "@/lib/deal-config";
import type { Commission, Order } from "@/lib/db/schema";

/** The dollar base a commission is calculated against, in cents. */
export function commissionBaseCents(
  order: Pick<Order, "totalPriceCents" | "costCents">,
  basis: "sale" | "margin",
): number {
  if (basis === "margin") {
    return Math.max(0, order.totalPriceCents - order.costCents);
  }
  return order.totalPriceCents;
}

/** Computed payout for a single commission line, in integer cents. */
export function commissionAmountCents(
  order: Pick<Order, "totalPriceCents" | "costCents">,
  c: Pick<Commission, "kind" | "basis" | "value">,
): number {
  if (c.kind === "flat") return c.value;
  const base = commissionBaseCents(order, c.basis);
  return Math.round((base * c.value) / 100);
}

/** Total commission across line items for an order, in cents. */
export function totalCommissionCents(
  order: Pick<Order, "totalPriceCents" | "costCents">,
  lines: Array<Pick<Commission, "kind" | "basis" | "value">>,
): number {
  return lines.reduce((sum, c) => sum + commissionAmountCents(order, c), 0);
}

/* ----------------------------------------------------------------------- */
/* The deal's tiered 3-stream rules (closing + setting + brand royalty).   */
/* Tier is chosen by the van's sequence number within its calendar year.   */
/* ----------------------------------------------------------------------- */

/** Percent for a given van sequence number (1-based) from a tier table. */
export function tierPct(tiers: CommissionTier[], vanNumber: number): number {
  for (const t of tiers) {
    if (t.maxVan === null || vanNumber <= t.maxVan) return t.pct;
  }
  return tiers.length ? tiers[tiers.length - 1].pct : 0;
}

export type CommissionStream = "closing" | "setting" | "royalty";

export interface StandardCommission {
  stream: CommissionStream;
  payee: string;
  pct: number;
  amountCents: number;
}

/**
 * The three standard commission lines for a *sold* deal, given its van
 * sequence number in the calendar year and the configured rules.
 *  - closing: tiered, paid to the deal's closer (owner name or config default)
 *  - setting: tiered, paid to the setter — ONLY if the deal was pipeline-sourced
 *  - royalty: flat %, paid to the brand owner on every branded sale
 */
export function standardCommissions(
  order: Pick<
    Order,
    "totalPriceCents" | "pipelineSourced"
  >,
  vanNumber: number,
  config: CommissionConfig,
  closerName?: string | null,
): StandardCommission[] {
  const sale = order.totalPriceCents;
  const pctTo = (pct: number) => Math.round((sale * pct) / 100);

  const closingPct = tierPct(config.closing, vanNumber);
  const out: StandardCommission[] = [
    {
      stream: "closing",
      payee: closerName || config.closerName,
      pct: closingPct,
      amountCents: pctTo(closingPct),
    },
  ];

  if (order.pipelineSourced) {
    const settingPct = tierPct(config.setting, vanNumber);
    out.push({
      stream: "setting",
      payee: config.setterName,
      pct: settingPct,
      amountCents: pctTo(settingPct),
    });
  }

  out.push({
    stream: "royalty",
    payee: config.brandOwnerName,
    pct: config.royaltyPct,
    amountCents: pctTo(config.royaltyPct),
  });

  return out;
}
