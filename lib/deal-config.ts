/**
 * Product (SKU) and commission configuration — the numbers from the Phase-1
 * partnership deal (see CLAUDE.md). Stored in the `settings` table so they're
 * editable in the admin, with these deal-accurate values as the fallback.
 */
import { getSetting } from "@/lib/db/queries";

export interface Sku {
  code: string;
  name: string;
  priceCents: number;
  costCents: number;
}

export interface AddOn {
  name: string;
  priceCents: number;
}

/** A tier of a commission stream: applies to vans up to `maxVan` (null = no cap). */
export interface CommissionTier {
  maxVan: number | null;
  pct: number;
}

export interface CommissionConfig {
  /** Closing commission tiers (Shaiden / the deal owner). */
  closing: CommissionTier[];
  /** Setting commission tiers (Kial) — only paid on pipeline-sourced deals. */
  setting: CommissionTier[];
  /** Flat brand royalty on every branded sale, regardless of closer. */
  royaltyPct: number;
  /** Default payees by role (overridable per deal for the closer via owner). */
  closerName: string;
  setterName: string;
  brandOwnerName: string;
}

export const DEFAULT_SKUS: Sku[] = [
  { code: "144", name: "Mothership 144", priceCents: 299_000_00, costCents: 130_000_00 },
  { code: "170", name: "Mothership 170", priceCents: 349_000_00, costCents: 150_000_00 },
];

/** Placeholder add-on menu — Brandon to finalize pricing (up to $100K/van). */
export const DEFAULT_ADDONS: AddOn[] = [];

export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  closing: [
    { maxVan: 2, pct: 8 },
    { maxVan: 5, pct: 10 },
    { maxVan: 9, pct: 12 },
    { maxVan: null, pct: 15 },
  ],
  setting: [
    { maxVan: 2, pct: 2 },
    { maxVan: 5, pct: 2.5 },
    { maxVan: 9, pct: 3 },
    { maxVan: null, pct: 3.5 },
  ],
  royaltyPct: 3,
  closerName: "Shaiden",
  setterName: "Kial",
  brandOwnerName: "Shaiden",
};

export interface DealConfig {
  skus: Sku[];
  addOns: AddOn[];
  commission: CommissionConfig;
}

/** Read SKUs / add-ons / commission rules from settings, with deal defaults. */
export async function getDealConfig(): Promise<DealConfig> {
  const [skus, addOns, commission] = await Promise.all([
    getSetting<Sku[]>("skus"),
    getSetting<AddOn[]>("addOns"),
    getSetting<CommissionConfig>("commissionConfig"),
  ]);
  return {
    skus: skus && skus.length ? skus : DEFAULT_SKUS,
    addOns: addOns ?? DEFAULT_ADDONS,
    commission: commission ?? DEFAULT_COMMISSION_CONFIG,
  };
}
