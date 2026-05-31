import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { listApplications, listOrders } from "@/lib/db/queries";

/** Escape a CSV cell. */
function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}

export async function GET(req: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = new URL(req.url).searchParams.get("type") ?? "applications";
  let csv: string;
  let filename: string;

  if (type === "customers") {
    const [apps, orders] = await Promise.all([
      listApplications(),
      listOrders(),
    ]);
    const seen = new Map<string, { name: string; phone: string }>();
    for (const a of apps)
      if (a.email && !seen.has(a.email.toLowerCase()))
        seen.set(a.email.toLowerCase(), {
          name: a.name ?? "",
          phone: a.phone ?? "",
        });
    for (const o of orders)
      if (o.customerEmail && !seen.has(o.customerEmail.toLowerCase()))
        seen.set(o.customerEmail.toLowerCase(), {
          name: o.customerName,
          phone: o.customerPhone ?? "",
        });
    csv = toCsv(
      ["email", "name", "phone"],
      [...seen.entries()].map(([email, v]) => [email, v.name, v.phone]),
    );
    filename = "mothership-customers.csv";
  } else {
    const apps = await listApplications();
    csv = toCsv(
      ["id", "type", "name", "email", "phone", "status", "created"],
      apps.map((a) => [
        a.id,
        a.type,
        a.name ?? "",
        a.email,
        a.phone ?? "",
        a.status,
        a.createdAt.toISOString(),
      ]),
    );
    filename = "mothership-applications.csv";
  }

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
