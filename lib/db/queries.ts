/**
 * Typed data-access helpers for the admin portal. Every function tolerates a
 * missing database (`db === null`) by returning an empty/no-op result, so the
 * UI degrades gracefully instead of throwing.
 */
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "./index";
import {
  activityLog,
  applications,
  bookings,
  buildUpdates,
  commissions,
  orders,
  payments,
  settings,
  teamMembers,
  type Application,
  type ApplicationStatus,
  type ApplicationType,
  type Booking,
  type BookingStatus,
  type BuildStage,
  type BuildUpdate,
  type Commission,
  type CommissionBasis,
  type CommissionKind,
  type Order,
  type OrderStatus,
  type Payment,
  type PipelineStage,
  type TeamMember,
} from "./schema";

/* ----------------------------- activity log ----------------------------- */
export async function logActivity(action: string, detail?: string) {
  if (!db) return;
  await db.insert(activityLog).values({ action, detail });
}

export async function recentActivity(limit = 12) {
  if (!db) return [];
  return db
    .select()
    .from(activityLog)
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}

/* ----------------------------- applications ----------------------------- */
export async function insertApplication(input: {
  type: ApplicationType;
  name?: string | null;
  email: string;
  phone?: string | null;
  data: Record<string, unknown>;
}): Promise<Application | null> {
  if (!db) return null;
  const [row] = await db.insert(applications).values(input).returning();
  return row ?? null;
}

export async function listApplications(filter?: {
  type?: ApplicationType;
  status?: ApplicationStatus;
}): Promise<Application[]> {
  if (!db) return [];
  const conds = [];
  if (filter?.type) conds.push(eq(applications.type, filter.type));
  if (filter?.status) conds.push(eq(applications.status, filter.status));
  return db
    .select()
    .from(applications)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(applications.createdAt));
}

export async function getApplication(id: number): Promise<Application | null> {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id));
  return row ?? null;
}

export async function updateApplication(
  id: number,
  patch: Partial<Pick<Application, "status" | "adminNotes">>,
): Promise<void> {
  if (!db) return;
  await db
    .update(applications)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(applications.id, id));
}

/* -------------------------------- orders -------------------------------- */
function newTrackerToken(): string {
  // URL-safe, unguessable. crypto is available in the Node/Edge runtime.
  return crypto.randomUUID().replace(/-/g, "");
}

export async function createOrder(input: {
  sourceApplicationId?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  config?: Record<string, unknown>;
  totalPriceCents?: number;
  depositCents?: number;
  pipelineStage?: PipelineStage;
  source?: string | null;
  sourceDetail?: string | null;
  ownerId?: number | null;
}): Promise<Order | null> {
  if (!db) return null;
  const [row] = await db
    .insert(orders)
    .values({
      sourceApplicationId: input.sourceApplicationId ?? null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone ?? null,
      config: input.config ?? {},
      totalPriceCents: input.totalPriceCents ?? 0,
      depositCents: input.depositCents ?? 0,
      pipelineStage: input.pipelineStage ?? "Cold lead",
      source: input.source ?? null,
      sourceDetail: input.sourceDetail ?? null,
      ownerId: input.ownerId ?? null,
      trackerToken: newTrackerToken(),
    })
    .returning();
  return row ?? null;
}

/** Find the deal created from a given application (lead → deal link). */
export async function getOrderByApplication(
  applicationId: number,
): Promise<Order | null> {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.sourceApplicationId, applicationId));
  return row ?? null;
}

export async function listOrders(): Promise<Order[]> {
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrder(id: number): Promise<Order | null> {
  if (!db) return null;
  const [row] = await db.select().from(orders).where(eq(orders.id, id));
  return row ?? null;
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.trackerToken, token));
  return row ?? null;
}

export async function updateOrder(
  id: number,
  patch: Partial<
    Pick<
      Order,
      | "customerName"
      | "customerEmail"
      | "customerPhone"
      | "config"
      | "totalPriceCents"
      | "depositCents"
      | "costCents"
      | "status"
      | "buildStage"
      | "pipelineStage"
      | "source"
      | "sourceDetail"
      | "ownerId"
      | "lostReason"
      | "closedAt"
      | "skuCode"
      | "pipelineSourced"
      | "soldAt"
    >
  >,
): Promise<void> {
  if (!db) return;
  await db
    .update(orders)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(orders.id, id));
}

/** Stages at/after which the sale is considered committed ("sold"). */
const SOLD_STAGES: PipelineStage[] = [
  "Deposit paid",
  "In build",
  "Ready",
  "Delivered",
];

/**
 * Advance/set the funnel stage. Stamps `closedAt` on terminal stages, and
 * `soldAt` the first time the deal reaches a committed stage (which fixes its
 * commission tier sequence for the calendar year).
 */
export async function setPipelineStage(
  id: number,
  stage: PipelineStage,
  lostReason?: string | null,
): Promise<void> {
  if (!db) return;
  const closed = stage === "Delivered" || stage === "Lost";
  const patch: Record<string, unknown> = {
    pipelineStage: stage,
    lostReason: stage === "Lost" ? (lostReason ?? null) : null,
    closedAt: closed ? new Date() : null,
    updatedAt: new Date(),
  };
  if (SOLD_STAGES.includes(stage)) {
    const [current] = await db
      .select({ soldAt: orders.soldAt })
      .from(orders)
      .where(eq(orders.id, id));
    if (current && !current.soldAt) patch.soldAt = new Date();
  }
  await db.update(orders).set(patch).where(eq(orders.id, id));
}

/**
 * Van sequence number within its calendar year for every sold deal, by soldAt.
 * Drives commission tiering (vans 1-2, 3-5, …) with the annual reset.
 */
export async function dealSequenceNumbers(): Promise<Map<number, number>> {
  if (!db) return new Map();
  const rows = await db
    .select({ id: orders.id, soldAt: orders.soldAt })
    .from(orders);
  const sold = rows
    .filter((r) => r.soldAt)
    .sort((a, b) => a.soldAt!.getTime() - b.soldAt!.getTime());
  const perYear = new Map<number, number>();
  const seq = new Map<number, number>();
  for (const r of sold) {
    const year = r.soldAt!.getFullYear();
    const n = (perYear.get(year) ?? 0) + 1;
    perYear.set(year, n);
    seq.set(r.id, n);
  }
  return seq;
}

/* ------------------------------- payments ------------------------------- */
export async function listPayments(orderId: number): Promise<Payment[]> {
  if (!db) return [];
  return db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(desc(payments.paidAt));
}

export async function addPayment(input: {
  orderId: number;
  amountCents: number;
  method?: string;
  reference?: string | null;
  note?: string | null;
  paidAt?: Date;
}): Promise<void> {
  if (!db) return;
  await db.insert(payments).values({
    orderId: input.orderId,
    amountCents: input.amountCents,
    method: input.method ?? "manual",
    reference: input.reference ?? null,
    note: input.note ?? null,
    paidAt: input.paidAt ?? new Date(),
  });
}

export async function amountPaidCents(orderId: number): Promise<number> {
  if (!db) return 0;
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
    .from(payments)
    .where(eq(payments.orderId, orderId));
  return Number(row?.total ?? 0);
}

/* ----------------------------- build updates ---------------------------- */
export async function listBuildUpdates(
  orderId: number,
  opts?: { visibleOnly?: boolean },
): Promise<BuildUpdate[]> {
  if (!db) return [];
  const conds = [eq(buildUpdates.orderId, orderId)];
  if (opts?.visibleOnly) conds.push(eq(buildUpdates.visibleToCustomer, true));
  return db
    .select()
    .from(buildUpdates)
    .where(and(...conds))
    .orderBy(desc(buildUpdates.createdAt));
}

export async function addBuildUpdate(input: {
  orderId: number;
  title: string;
  body?: string | null;
  stage?: BuildStage | null;
  photos?: string[];
  visibleToCustomer?: boolean;
}): Promise<void> {
  if (!db) return;
  await db.insert(buildUpdates).values({
    orderId: input.orderId,
    title: input.title,
    body: input.body ?? null,
    stage: input.stage ?? null,
    photos: input.photos ?? [],
    visibleToCustomer: input.visibleToCustomer ?? true,
  });
}

export async function deleteBuildUpdate(id: number): Promise<void> {
  if (!db) return;
  await db.delete(buildUpdates).where(eq(buildUpdates.id, id));
}

/* ------------------------------- bookings ------------------------------- */
export async function listBookings(): Promise<Booking[]> {
  if (!db) return [];
  return db.select().from(bookings).orderBy(bookings.startDate);
}

export async function createBooking(input: {
  startDate: string;
  endDate: string;
  status?: BookingStatus;
  label: string;
  customerName?: string | null;
  customerEmail?: string | null;
  sourceApplicationId?: number | null;
  notes?: string | null;
}): Promise<Booking | null> {
  if (!db) return null;
  const [row] = await db
    .insert(bookings)
    .values({
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status ?? "booked",
      label: input.label,
      customerName: input.customerName ?? null,
      customerEmail: input.customerEmail ?? null,
      sourceApplicationId: input.sourceApplicationId ?? null,
      notes: input.notes ?? null,
    })
    .returning();
  return row ?? null;
}

export async function updateBooking(
  id: number,
  patch: Partial<
    Pick<Booking, "startDate" | "endDate" | "status" | "label" | "notes">
  >,
): Promise<void> {
  if (!db) return;
  await db.update(bookings).set(patch).where(eq(bookings.id, id));
}

export async function deleteBooking(id: number): Promise<void> {
  if (!db) return;
  await db.delete(bookings).where(eq(bookings.id, id));
}

/* ------------------------------- settings ------------------------------- */
export async function getSetting<T>(key: string): Promise<T | null> {
  if (!db) return null;
  const [row] = await db.select().from(settings).where(eq(settings.key, key));
  return (row?.value as T) ?? null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  if (!db) return;
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
}

/* ----------------------------- team members ----------------------------- */
export async function listTeamMembers(
  opts?: { activeOnly?: boolean },
): Promise<TeamMember[]> {
  if (!db) return [];
  const rows = await db.select().from(teamMembers).orderBy(teamMembers.name);
  return opts?.activeOnly ? rows.filter((m) => m.active) : rows;
}

export async function addTeamMember(name: string, role?: string | null) {
  if (!db) return;
  await db.insert(teamMembers).values({ name, role: role ?? null });
}

/** Seed the three default reps the first time the team is empty. */
export async function ensureDefaultTeam(): Promise<void> {
  if (!db) return;
  const existing = await db.select().from(teamMembers).limit(1);
  if (existing.length > 0) return;
  await db.insert(teamMembers).values([
    { name: "Kial", role: "Sales" },
    { name: "Shaiden", role: "Sales, Marketing & Branding" },
    { name: "Brandon", role: "Design & Technology" },
  ]);
}

export async function setTeamMemberActive(id: number, active: boolean) {
  if (!db) return;
  await db.update(teamMembers).set({ active }).where(eq(teamMembers.id, id));
}

/* ------------------------------ commissions ----------------------------- */
export async function listCommissions(orderId: number): Promise<Commission[]> {
  if (!db) return [];
  return db
    .select()
    .from(commissions)
    .where(eq(commissions.orderId, orderId))
    .orderBy(commissions.id);
}

export async function addCommission(input: {
  orderId: number;
  payee: string;
  teamMemberId?: number | null;
  kind: CommissionKind;
  basis: CommissionBasis;
  value: number;
  note?: string | null;
}) {
  if (!db) return;
  await db.insert(commissions).values({
    orderId: input.orderId,
    payee: input.payee,
    teamMemberId: input.teamMemberId ?? null,
    kind: input.kind,
    basis: input.basis,
    value: input.value,
    note: input.note ?? null,
  });
}

export async function deleteCommission(id: number) {
  if (!db) return;
  await db.delete(commissions).where(eq(commissions.id, id));
}

/** All deals (orders) — newest first, for the pipeline board. */
export async function listDeals(): Promise<Order[]> {
  return listOrders();
}

/* ------------------------------ performance ----------------------------- */
/** Orders + their commission lines, for performance aggregation. */
export async function ordersWithCommissions(): Promise<
  Array<{ order: Order; lines: Commission[] }>
> {
  if (!db) return [];
  const [allOrders, allComm] = await Promise.all([
    db.select().from(orders),
    db.select().from(commissions),
  ]);
  return allOrders.map((order) => ({
    order,
    lines: allComm.filter((c) => c.orderId === order.id),
  }));
}

/* ------------------------------ dashboard ------------------------------- */
export async function dashboardCounts() {
  if (!db) {
    return {
      newApplications: 0,
      activeBuilds: 0,
      upcomingBookings: 0,
      revenueCents: 0,
    };
  }
  const todayIso = new Date().toISOString().slice(0, 10);
  const [[apps], [builds], [upcoming], [rev]] = await Promise.all([
    db
      .select({ c: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.status, "new")),
    db
      .select({ c: sql<number>`count(*)` })
      .from(orders)
      .where(
        sql`${orders.pipelineStage} in ('Deposit paid','In build','Ready')`,
      ),
    db
      .select({ c: sql<number>`count(*)` })
      .from(bookings)
      .where(gte(bookings.endDate, todayIso)),
    db
      .select({ total: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
      .from(payments),
  ]);
  return {
    newApplications: Number(apps?.c ?? 0),
    activeBuilds: Number(builds?.c ?? 0),
    upcomingBookings: Number(upcoming?.c ?? 0),
    revenueCents: Number(rev?.total ?? 0),
  };
}

export type { OrderStatus, PipelineStage };
