"use server";

import { revalidatePath } from "next/cache";

import {
  createBooking,
  createOrder,
  getApplication,
  getOrderByApplication,
  logActivity,
  setPipelineStage,
  updateApplication,
} from "@/lib/db/queries";
import type { ApplicationStatus } from "@/lib/db/schema";

export async function setApplicationStatus(
  id: number,
  status: ApplicationStatus,
) {
  await updateApplication(id, { status });
  await logActivity("application.status", `#${id} → ${status}`);
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/applications");
}

export async function saveApplicationNotes(id: number, notes: string) {
  await updateApplication(id, { adminNotes: notes });
  revalidatePath(`/admin/applications/${id}`);
}

/**
 * Approve an application. A reservation/consultation/viewing becomes a draft
 * order; a creator application becomes a (pending) booking on the rental
 * calendar. Returns where to redirect the admin next.
 */
export async function approveApplication(
  id: number,
): Promise<{ redirect?: string }> {
  const app = await getApplication(id);
  if (!app) return {};

  await updateApplication(id, { status: "approved" });

  if (app.type === "creator") {
    const data = app.data as {
      pickupDate?: string;
      returnDate?: string;
      destination?: string;
    };
    if (data.pickupDate && data.returnDate) {
      const booking = await createBooking({
        startDate: data.pickupDate,
        endDate: data.returnDate,
        status: "pending",
        label: `${app.name ?? app.email} — creator trip`,
        customerName: app.name,
        customerEmail: app.email,
        sourceApplicationId: app.id,
        notes: data.destination ? `Destination: ${data.destination}` : null,
      });
      await logActivity("application.approve", `#${id} → booking`);
      revalidatePath("/admin/calendar");
      revalidatePath("/admin/applications");
      return booking ? { redirect: "/admin/calendar" } : {};
    }
  }

  if (
    app.type === "reserve" ||
    app.type === "consultation" ||
    app.type === "viewing"
  ) {
    // A deal was opened at lead time — advance it rather than duplicate.
    const existing = await getOrderByApplication(app.id);
    if (existing) {
      await setPipelineStage(existing.id, "Qualified");
      await logActivity("application.approve", `#${id} → deal #${existing.id}`);
      revalidatePath("/admin/orders");
      revalidatePath("/admin/applications");
      return { redirect: `/admin/orders/${existing.id}` };
    }
    const order = await createOrder({
      sourceApplicationId: app.id,
      customerName: app.name ?? app.email,
      customerEmail: app.email,
      customerPhone: app.phone,
      pipelineStage: "Qualified",
      source: (app.data as { source?: string }).source ?? null,
      config:
        app.type === "reserve"
          ? {
              timeline: (app.data as { timeline?: string }).timeline ?? "",
              useCase: (app.data as { useCase?: string }).useCase ?? "",
            }
          : {},
    });
    await logActivity("application.approve", `#${id} → order`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin/applications");
    return order ? { redirect: `/admin/orders/${order.id}` } : {};
  }

  await logActivity("application.approve", `#${id}`);
  revalidatePath("/admin/applications");
  return {};
}
