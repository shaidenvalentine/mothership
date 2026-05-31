import Link from "next/link";

import { listApplications } from "@/lib/db/queries";
import type { ApplicationStatus, ApplicationType } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_TONE,
  APPLICATION_TYPE_LABEL,
  Badge,
} from "../_components/badges";

export const dynamic = "force-dynamic";

const TYPE_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "reserve", label: "Reservations" },
  { value: "creator", label: "Creators" },
  { value: "consultation", label: "Consultations" },
  { value: "viewing", label: "Viewings" },
  { value: "newsletter", label: "Newsletter" },
];

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "Any status" },
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const type = (sp.type || undefined) as ApplicationType | undefined;
  const status = (sp.status || undefined) as ApplicationStatus | undefined;
  const rows = await listApplications({ type, status });

  const qs = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    const t = next.type ?? sp.type ?? "";
    const s = next.status ?? sp.status ?? "";
    if (t) params.set("type", t);
    if (s) params.set("status", s);
    const str = params.toString();
    return str ? `?${str}` : "";
  };

  return (
    <div>
      <span className="ms-caption">Inbox</span>
      <h1 className="mt-2 font-display text-display-md text-ms-bone">
        Applications
      </h1>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/applications${qs({ type: f.value })}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition",
              (sp.type ?? "") === f.value
                ? "border-ms-bone bg-ms-bone text-ms-black"
                : "border-ms-graphite text-ms-fog hover:text-ms-bone",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/applications${qs({ status: f.value })}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition",
              (sp.status ?? "") === f.value
                ? "border-ms-ion text-ms-ion"
                : "border-ms-graphite text-ms-ash hover:text-ms-bone",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-ms-graphite/60">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ms-ash">
            No applications yet.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ms-graphite/60 text-xs uppercase tracking-wide text-ms-ash">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Received</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-ms-graphite/30 transition hover:bg-ms-obsidian"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/applications/${r.id}`}
                      className="text-ms-bone"
                    >
                      {APPLICATION_TYPE_LABEL[r.type] ?? r.type}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ms-fog">{r.name ?? "—"}</td>
                  <td className="px-5 py-3 text-ms-fog">{r.email}</td>
                  <td className="px-5 py-3 text-ms-ash">
                    {formatDateTime(r.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={APPLICATION_STATUS_TONE[r.status]}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
