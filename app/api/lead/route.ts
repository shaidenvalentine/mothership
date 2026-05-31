import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createOrder, insertApplication } from "@/lib/db/queries";
import type { ApplicationType } from "@/lib/db/schema";
import { sendLeadEmail } from "@/lib/email";
import {
  consultationFields,
  creatorFields,
  newsletterFields,
  reserveFields,
  viewingFields,
} from "@/lib/schemas";

/** Lead types that represent buying intent and should enter the deal pipeline. */
const PIPELINE_TYPES = new Set<ApplicationType>([
  "reserve",
  "consultation",
  "viewing",
]);

/** Read first-touch attribution from the cookie set by <Attribution />. */
async function readAttribution(): Promise<{
  source: string;
  detail: string | null;
}> {
  try {
    const raw = (await cookies()).get("ms_attribution")?.value;
    if (!raw) return { source: "direct", detail: null };
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      source?: string;
    };
    return { source: parsed.source || "direct", detail: JSON.stringify(parsed) };
  } catch {
    return { source: "unknown", detail: null };
  }
}

/**
 * Persist a submission to the applications inbox and, for buying-intent leads,
 * open a deal in the pipeline at "Cold lead". Never throws — if the DB is
 * unconfigured the email path (the original behaviour) still succeeds.
 */
async function persist(
  type: ApplicationType,
  contact: { name?: string; email: string; phone?: string },
  data: Record<string, unknown>,
) {
  try {
    const attribution = await readAttribution();
    const app = await insertApplication({
      type,
      name: contact.name ?? null,
      email: contact.email,
      phone: contact.phone ?? null,
      data: { ...data, source: attribution.source },
    });

    if (app && PIPELINE_TYPES.has(type)) {
      await createOrder({
        sourceApplicationId: app.id,
        customerName: contact.name ?? contact.email,
        customerEmail: contact.email,
        customerPhone: contact.phone ?? null,
        pipelineStage: "Cold lead",
        source: attribution.source,
        sourceDetail: attribution.detail,
        config: type === "reserve" ? data : {},
      });
    }
  } catch (error) {
    console.error("[lead] DB persist failed (email still sent):", error);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const type = (body as { type?: unknown }).type;

  if (type === "reserve") {
    const parsed = reserveFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the form." },
        { status: 400 },
      );
    }
    const d = parsed.data;
    await sendLeadEmail("New Mothership reservation enquiry", [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      `Timeline: ${d.timeline}`,
      `Use case: ${d.useCase}`,
      `Message: ${d.message ?? "—"}`,
    ]);
    await persist(
      "reserve",
      { name: d.name, email: d.email, phone: d.phone },
      { timeline: d.timeline, useCase: d.useCase, message: d.message ?? "" },
    );
    return NextResponse.json({ ok: true });
  }

  if (type === "consultation") {
    const parsed = consultationFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the form." },
        { status: 400 },
      );
    }
    const d = parsed.data;
    await sendLeadEmail("New Mothership consultation request", [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "—"}`,
      `Message: ${d.message}`,
    ]);
    await persist(
      "consultation",
      { name: d.name, email: d.email, phone: d.phone },
      { message: d.message },
    );
    return NextResponse.json({ ok: true });
  }

  if (type === "creator") {
    const parsed = creatorFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the form." },
        { status: 400 },
      );
    }
    const d = parsed.data;
    await sendLeadEmail("New Mothership creator application", [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Instagram: ${d.instagram}`,
      `YouTube: ${d.youtube || "—"}`,
      `Total following: ${d.totalFollowing || "—"}`,
      `Trip: ${d.pickupDate} → ${d.returnDate}`,
      `Destination: ${d.destination}`,
      `Content plan: ${d.contentPlan}`,
    ]);
    await persist(
      "creator",
      { name: d.name, email: d.email },
      {
        instagram: d.instagram,
        youtube: d.youtube ?? "",
        totalFollowing: d.totalFollowing ?? "",
        pickupDate: d.pickupDate,
        returnDate: d.returnDate,
        destination: d.destination,
        contentPlan: d.contentPlan,
      },
    );
    return NextResponse.json({ ok: true });
  }

  if (type === "viewing") {
    const parsed = viewingFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please check the form." },
        { status: 400 },
      );
    }
    const d = parsed.data;
    await sendLeadEmail("New Mothership in-person viewing request", [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "—"}`,
      `Event / where: ${d.event || "—"}`,
      `Preferred date: ${d.preferredDate || "—"}`,
      `Message: ${d.message || "—"}`,
    ]);
    await persist(
      "viewing",
      { name: d.name, email: d.email, phone: d.phone },
      {
        event: d.event ?? "",
        preferredDate: d.preferredDate ?? "",
        message: d.message ?? "",
      },
    );
    return NextResponse.json({ ok: true });
  }

  if (type === "newsletter") {
    const parsed = newsletterFields.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email." },
        { status: 400 },
      );
    }
    await sendLeadEmail("New Mothership newsletter signup", [
      `Email: ${parsed.data.email}`,
    ]);
    await persist("newsletter", { email: parsed.data.email }, {});
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, error: "Unknown request type." },
    { status: 400 },
  );
}
