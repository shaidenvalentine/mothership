"use server";

import { revalidatePath } from "next/cache";

import {
  createBooking,
  deleteBooking,
  listBookings,
  logActivity,
  updateBooking,
} from "@/lib/db/queries";
import type { BookingStatus } from "@/lib/db/schema";

function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export async function addBookingAction(formData: FormData) {
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  if (!start || !end || end < start) return;
  await createBooking({
    startDate: start,
    endDate: end,
    status: (String(formData.get("status") ?? "booked") || "booked") as BookingStatus,
    label: String(formData.get("label") ?? "Booking") || "Booking",
    notes: String(formData.get("notes") ?? "") || null,
  });
  await logActivity("booking.create", `${start}→${end}`);
  revalidatePath("/admin/calendar");
}

export async function setBookingStatus(id: number, status: BookingStatus) {
  await updateBooking(id, { status });
  await logActivity("booking.status", `#${id} → ${status}`);
  revalidatePath("/admin/calendar");
}

/** Approve a pending creator date → mark it booked (with a conflict check). */
export async function approveBookingAction(
  id: number,
): Promise<{ conflict?: string }> {
  const all = await listBookings();
  const target = all.find((b) => b.id === id);
  if (!target) return {};
  const clash = all.find(
    (b) =>
      b.id !== id &&
      b.status === "booked" &&
      overlaps(target.startDate, target.endDate, b.startDate, b.endDate),
  );
  if (clash) {
    return { conflict: `Overlaps "${clash.label}" (${clash.startDate}→${clash.endDate})` };
  }
  await updateBooking(id, { status: "booked" });
  await logActivity("booking.approve", `#${id}`);
  revalidatePath("/admin/calendar");
  return {};
}

export async function deleteBookingAction(id: number) {
  await deleteBooking(id);
  await logActivity("booking.delete", `#${id}`);
  revalidatePath("/admin/calendar");
}
