"use server";

import { revalidatePath } from "next/cache";

import {
  addTeamMember,
  logActivity,
  setSetting,
  setTeamMemberActive,
} from "@/lib/db/queries";

export async function saveWindow(formData: FormData) {
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  if (!start || !end) return;
  await setSetting("applicationWindow", { start, end });
  await logActivity("settings.window", `${start}→${end}`);
  revalidatePath("/admin/settings");
  revalidatePath("/creators");
}

export async function saveTiers(formData: FormData) {
  // Stored as JSON so the admin can edit the full tier structure.
  try {
    const tiers = JSON.parse(String(formData.get("contentTiers") ?? "[]"));
    const always = JSON.parse(String(formData.get("alwaysExpected") ?? "[]"));
    await setSetting("contentTiers", tiers);
    await setSetting("alwaysExpected", always);
    await logActivity("settings.tiers");
    revalidatePath("/admin/settings");
    revalidatePath("/creators");
  } catch {
    // Invalid JSON — ignore the save (the form keeps the bad value visible).
  }
}

export async function addTeamMemberAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await addTeamMember(name, String(formData.get("role") ?? "") || null);
  await logActivity("team.add", name);
  revalidatePath("/admin/settings");
}

export async function toggleTeamMemberAction(id: number, active: boolean) {
  await setTeamMemberActive(id, active);
  revalidatePath("/admin/settings");
}

export async function saveLeadSources(formData: FormData) {
  const list = String(formData.get("sources") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  await setSetting("leadSources", list);
  await logActivity("settings.sources");
  revalidatePath("/admin/settings");
}

export async function saveProductConfig(formData: FormData) {
  try {
    const skus = JSON.parse(String(formData.get("skus") ?? "[]"));
    const addOns = JSON.parse(String(formData.get("addOns") ?? "[]"));
    await setSetting("skus", skus);
    await setSetting("addOns", addOns);
    await logActivity("settings.products");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/orders");
  } catch {
    /* invalid JSON — keep the bad value visible, don't save */
  }
}

export async function saveCommissionConfig(formData: FormData) {
  try {
    const config = JSON.parse(String(formData.get("commissionConfig") ?? "{}"));
    await setSetting("commissionConfig", config);
    await logActivity("settings.commission");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/performance");
  } catch {
    /* invalid JSON — ignore */
  }
}

export async function saveDeposit(formData: FormData) {
  const pct = Number(formData.get("depositPercent") ?? 50);
  await setSetting("depositPercent", Number.isFinite(pct) ? pct : 50);
  await logActivity("settings.deposit", `${pct}%`);
  revalidatePath("/admin/settings");
}
