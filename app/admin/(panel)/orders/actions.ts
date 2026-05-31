"use server";

import { revalidatePath } from "next/cache";

import {
  addBuildUpdate,
  addCommission,
  addPayment,
  createOrder,
  deleteBuildUpdate,
  deleteCommission,
  getOrder,
  logActivity,
  setPipelineStage,
  updateOrder,
} from "@/lib/db/queries";
import type {
  BuildStage,
  CommissionBasis,
  CommissionKind,
  OrderStatus,
  PipelineStage,
} from "@/lib/db/schema";
import { getDealConfig } from "@/lib/deal-config";
import { sendLeadEmail } from "@/lib/email";
import { parseDollarsToCents } from "@/lib/format";

export async function createBlankOrder(): Promise<{ redirect?: string }> {
  const order = await createOrder({
    customerName: "New customer",
    customerEmail: "",
  });
  if (!order) return {};
  await logActivity("order.create", `#${order.id}`);
  revalidatePath("/admin/orders");
  return { redirect: `/admin/orders/${order.id}` };
}

export async function saveOrderDetails(id: number, formData: FormData) {
  const ownerRaw = String(formData.get("ownerId") ?? "");
  await updateOrder(id, {
    customerName: String(formData.get("customerName") ?? ""),
    customerEmail: String(formData.get("customerEmail") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? "") || null,
    totalPriceCents: parseDollarsToCents(String(formData.get("totalPrice") ?? "")),
    depositCents: parseDollarsToCents(String(formData.get("deposit") ?? "")),
    costCents: parseDollarsToCents(String(formData.get("cost") ?? "")),
    source: String(formData.get("source") ?? "") || null,
    ownerId: ownerRaw ? Number(ownerRaw) : null,
    config: {
      model: String(formData.get("model") ?? ""),
      notes: String(formData.get("configNotes") ?? ""),
    },
  });
  await logActivity("order.update", `#${id} details`);
  revalidatePath(`/admin/orders/${id}`);
}

/** Apply a SKU + add-on selection → recompute sale price & build cost. */
export async function saveConfiguration(orderId: number, formData: FormData) {
  const order = await getOrder(orderId);
  if (!order) return;
  const { skus, addOns } = await getDealConfig();

  const skuCode = String(formData.get("skuCode") ?? "");
  const sku = skus.find((s) => s.code === skuCode);
  const selected = formData.getAll("addon").map(String);
  const chosen = addOns.filter((a) => selected.includes(a.name));
  const addOnTotal = chosen.reduce((sum, a) => sum + a.priceCents, 0);

  await updateOrder(orderId, {
    skuCode: sku ? sku.code : null,
    totalPriceCents: sku ? sku.priceCents + addOnTotal : order.totalPriceCents,
    costCents: sku ? sku.costCents : order.costCents,
    config: {
      ...(order.config ?? {}),
      addOns: chosen,
    },
  });
  await logActivity("deal.configure", `#${orderId} → ${skuCode}`);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/performance");
}

export async function setPipelineSourced(orderId: number, value: boolean) {
  await updateOrder(orderId, { pipelineSourced: value });
  await logActivity("deal.pipelineSourced", `#${orderId} → ${value}`);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/performance");
}

export async function setDealStage(
  id: number,
  stage: PipelineStage,
  lostReason?: string,
) {
  await setPipelineStage(id, stage, lostReason ?? null);
  await logActivity("deal.stage", `#${id} → ${stage}`);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/performance");
}

export async function addCommissionAction(orderId: number, formData: FormData) {
  const value =
    String(formData.get("kind")) === "flat"
      ? parseDollarsToCents(String(formData.get("value") ?? ""))
      : Number(String(formData.get("value") ?? "0")) || 0;
  await addCommission({
    orderId,
    payee: String(formData.get("payee") ?? "").trim() || "Unassigned",
    teamMemberId: formData.get("teamMemberId")
      ? Number(formData.get("teamMemberId"))
      : null,
    kind: (String(formData.get("kind") ?? "percent") as CommissionKind),
    basis: (String(formData.get("basis") ?? "sale") as CommissionBasis),
    value,
    note: String(formData.get("note") ?? "") || null,
  });
  await logActivity("commission.add", `#${orderId}`);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/performance");
}

export async function removeCommissionAction(
  orderId: number,
  commissionId: number,
) {
  await deleteCommission(commissionId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/performance");
}

export async function setOrderStatus(id: number, status: OrderStatus) {
  await updateOrder(id, { status });
  await logActivity("order.status", `#${id} → ${status}`);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function setOrderStage(id: number, buildStage: BuildStage) {
  await updateOrder(id, { buildStage });
  await logActivity("order.stage", `#${id} → ${buildStage}`);
  revalidatePath(`/admin/orders/${id}`);
}

export async function recordPayment(orderId: number, formData: FormData) {
  const amountCents = parseDollarsToCents(String(formData.get("amount") ?? ""));
  if (amountCents <= 0) return;
  await addPayment({
    orderId,
    amountCents,
    method: String(formData.get("method") ?? "manual"),
    note: String(formData.get("note") ?? "") || null,
  });
  await logActivity("payment.record", `#${orderId} +${amountCents}c`);
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function addUpdate(orderId: number, formData: FormData) {
  const photos = String(formData.get("photos") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await addBuildUpdate({
    orderId,
    title: String(formData.get("title") ?? "Update"),
    body: String(formData.get("body") ?? "") || null,
    stage: (String(formData.get("stage") ?? "") || null) as BuildStage | null,
    photos,
    visibleToCustomer: formData.get("visible") === "on",
  });
  await logActivity("build.update", `#${orderId}`);

  // Optionally notify the customer that their tracker has a new update.
  if (formData.get("notify") === "on") {
    const order = await getOrder(orderId);
    if (order?.customerEmail) {
      await sendLeadEmail("Your Mothership build has a new update", [
        `Hi ${order.customerName},`,
        "",
        "There's a new update on your build tracker:",
        String(formData.get("title") ?? ""),
        "",
        `View it here: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/build/${order.trackerToken}`,
      ]);
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function removeUpdate(orderId: number, updateId: number) {
  await deleteBuildUpdate(updateId);
  revalidatePath(`/admin/orders/${orderId}`);
}
