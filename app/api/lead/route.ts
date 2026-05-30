import { NextResponse } from "next/server";

import { sendLeadEmail } from "@/lib/email";
import {
  consultationFields,
  creatorFields,
  newsletterFields,
  reserveFields,
  viewingFields,
} from "@/lib/schemas";

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
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, error: "Unknown request type." },
    { status: 400 },
  );
}
