/**
 * Mothership operational database — Drizzle schema.
 *
 * The public marketing site never required a database; this layer powers the
 * admin portal (applications inbox, van orders + build trackers, the rental
 * calendar) and the customer-facing build tracker at /build/[token].
 *
 * Money is stored in **integer cents** to avoid float drift. Dates that map to
 * the public availability calendar stay as ISO `YYYY-MM-DD` strings so they
 * compare lexicographically (see lib/dates.ts).
 */
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Applications — the unified inbound inbox.                          */
/* Every public form lands here (in addition to the Resend email).    */
/* ------------------------------------------------------------------ */
export type ApplicationType =
  | "reserve"
  | "consultation"
  | "creator"
  | "newsletter"
  | "viewing";
export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "approved"
  | "rejected"
  | "archived";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  type: text("type").$type<ApplicationType>().notNull(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  /** Type-specific fields (timeline, useCase, instagram, dates, …). */
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
  status: text("status")
    .$type<ApplicationStatus>()
    .notNull()
    .default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Orders / Deals — a customer in the pipeline (cold lead → delivered).*/
/* An "order" IS the deal record; it exists from the moment a lead     */
/* enters and carries the whole funnel + commission.                   */
/* ------------------------------------------------------------------ */
export type OrderStatus =
  | "deposit_pending"
  | "deposit_paid"
  | "in_build"
  | "ready"
  | "delivered"
  | "cancelled";

/** The full sales funnel. `Lost` is terminal (rendered off to the side). */
export const PIPELINE_STAGES = [
  "Cold lead",
  "Contacted",
  "Qualified",
  "Consultation",
  "Quote sent",
  "Deposit paid",
  "In build",
  "Ready",
  "Delivered",
  "Lost",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** Stages that mean money has been committed / the build is underway. */
export const WON_STAGE: PipelineStage = "Delivered";
export const ACTIVE_BUILD_STAGES: PipelineStage[] = [
  "Deposit paid",
  "In build",
  "Ready",
];
/** Stages still open in the funnel (for conversion math / board columns). */
export const OPEN_STAGES: PipelineStage[] = PIPELINE_STAGES.filter(
  (s) => s !== "Delivered" && s !== "Lost",
);

/** Ordered build stages — also drives the tracker progress bar. */
export const BUILD_STAGES = [
  "Reservation",
  "Van sourced",
  "Design finalized",
  "Build in progress",
  "Electrical & systems",
  "Interior & finishing",
  "Quality & detailing",
  "Ready for delivery",
  "Delivered",
] as const;
export type BuildStage = (typeof BUILD_STAGES)[number];

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  /** The application this order was approved from, if any. */
  sourceApplicationId: integer("source_application_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  /** Model / options / notes about the configured build. */
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  /** Totals in integer cents. `costCents` enables margin-based commissions. */
  totalPriceCents: integer("total_price_cents").notNull().default(0),
  depositCents: integer("deposit_cents").notNull().default(0),
  costCents: integer("cost_cents").notNull().default(0),
  status: text("status")
    .$type<OrderStatus>()
    .notNull()
    .default("deposit_pending"),
  buildStage: text("build_stage")
    .$type<BuildStage>()
    .notNull()
    .default("Reservation"),
  /** Master funnel position — cold lead → delivered. */
  pipelineStage: text("pipeline_stage")
    .$type<PipelineStage>()
    .notNull()
    .default("Cold lead"),
  /** Where the lead came from (e.g. "instagram", "referral", "paid"). */
  source: text("source"),
  /** Raw attribution detail — first-touch UTM/referrer JSON or note. */
  sourceDetail: text("source_detail"),
  /** Assigned team member (deal owner). */
  ownerId: integer("owner_id"),
  /** Why a deal was marked Lost. */
  lostReason: text("lost_reason"),
  /** When the deal closed (Delivered or Lost). */
  closedAt: timestamp("closed_at", { withTimezone: true }),
  /** When the sale committed (first reached Deposit paid) — drives commission
   *  tiering: the van's sequence number within its calendar year. */
  soldAt: timestamp("sold_at", { withTimezone: true }),
  /** Whether the lead came through Kial's pipeline (gates the setting commission). */
  pipelineSourced: boolean("pipeline_sourced").notNull().default(true),
  /** Selected SKU code ("144" | "170"). */
  skuCode: text("sku_code"),
  /** Opaque token for the customer-facing /build/[token] page. */
  trackerToken: text("tracker_token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Payments — manual ledger now; Stripe drops in later (same table).  */
/* ------------------------------------------------------------------ */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  amountCents: integer("amount_cents").notNull(),
  /** "manual" | "stripe" | "wire" | "card" | … */
  method: text("method").notNull().default("manual"),
  /** External reference (Stripe payment intent, wire ref, …). */
  reference: text("reference"),
  note: text("note"),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Build updates — the per-order timeline shown on the tracker.       */
/* ------------------------------------------------------------------ */
export const buildUpdates = pgTable("build_updates", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  stage: text("stage").$type<BuildStage>(),
  /** Vercel Blob URLs. */
  photos: jsonb("photos").$type<string[]>().notNull().default([]),
  visibleToCustomer: boolean("visible_to_customer").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Bookings — the rental / demo-van calendar (DB form of the blocks). */
/* ------------------------------------------------------------------ */
export type BookingStatus = "booked" | "held" | "pending";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  /** Inclusive ISO YYYY-MM-DD range. */
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").$type<BookingStatus>().notNull().default("booked"),
  label: text("label").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  sourceApplicationId: integer("source_application_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Team members — the reps a deal can be owned by / pay commission to. */
/* (Kial, Shaiden, Brandon.)                                          */
/* ------------------------------------------------------------------ */
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Commissions — flexible per-deal payout line items.                 */
/* amount = kind==='percent' ? base*value/100 : value(cents),         */
/* where base = basis==='margin' ? (total-cost) : total.              */
/* ------------------------------------------------------------------ */
export type CommissionKind = "percent" | "flat";
export type CommissionBasis = "sale" | "margin";

export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  /** Who earns it — free text, defaults from a team member's name. */
  payee: text("payee").notNull(),
  teamMemberId: integer("team_member_id"),
  kind: text("kind").$type<CommissionKind>().notNull().default("percent"),
  basis: text("basis").$type<CommissionBasis>().notNull().default("sale"),
  /** Percent: whole number (10 = 10%). Flat: integer cents. */
  value: integer("value").notNull().default(0),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Settings — key/value config editable from the admin.               */
/* (creator application window, content tiers, deposit %, pricing.)   */
/* ------------------------------------------------------------------ */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Activity log — light audit trail of admin mutations.               */
/* ------------------------------------------------------------------ */
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Application = typeof applications.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Commission = typeof commissions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type BuildUpdate = typeof buildUpdates.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type ActivityEntry = typeof activityLog.$inferSelect;
