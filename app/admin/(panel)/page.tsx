import Link from "next/link";

import {
  dashboardCounts,
  listApplications,
  listBookings,
  recentActivity,
} from "@/lib/db/queries";
import { formatCents, formatDateTime } from "@/lib/format";
import { formatLong } from "@/lib/dates";
import {
  APPLICATION_STATUS_TONE,
  APPLICATION_TYPE_LABEL,
  Badge,
} from "./_components/badges";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [counts, recentApps, activity, bookings] = await Promise.all([
    dashboardCounts(),
    listApplications(),
    recentActivity(8),
    listBookings(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings
    .filter((b) => b.endDate >= today)
    .slice(0, 4);

  const stats = [
    { label: "New applications", value: counts.newApplications, href: "/admin/applications?status=new" },
    { label: "Active builds", value: counts.activeBuilds, href: "/admin/orders" },
    { label: "Upcoming bookings", value: counts.upcomingBookings, href: "/admin/calendar" },
    { label: "Revenue recorded", value: formatCents(counts.revenueCents), href: "/admin/orders" },
  ];

  return (
    <div>
      <span className="ms-caption">Overview</span>
      <h1 className="mt-2 font-display text-display-md text-ms-bone">
        Dashboard
      </h1>

      {/* KPI cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-5 transition hover:border-ms-ion/50"
          >
            <div className="text-2xl font-display text-ms-bone">{s.value}</div>
            <div className="mt-1 text-xs text-ms-ash">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent applications */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ms-bone">
              Recent applications
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs text-ms-ash transition hover:text-ms-bone"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentApps.length === 0 ? (
              <p className="text-sm text-ms-ash">No applications yet.</p>
            ) : (
              recentApps.slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/applications/${a.id}`}
                  className="flex items-center justify-between rounded-lg border border-ms-graphite/40 px-4 py-3 transition hover:bg-ms-obsidian"
                >
                  <div>
                    <span className="text-ms-bone">{a.name ?? a.email}</span>
                    <span className="ml-2 text-xs text-ms-ash">
                      {APPLICATION_TYPE_LABEL[a.type] ?? a.type}
                    </span>
                  </div>
                  <Badge tone={APPLICATION_STATUS_TONE[a.status]}>
                    {a.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Side: upcoming + activity */}
        <section className="space-y-8">
          <div>
            <h2 className="font-display text-xl text-ms-bone">Upcoming dates</h2>
            <div className="mt-4 space-y-2 text-sm">
              {upcoming.length === 0 ? (
                <p className="text-sm text-ms-ash">Calendar is open.</p>
              ) : (
                upcoming.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-lg border border-ms-graphite/40 px-4 py-2"
                  >
                    <div className="text-ms-bone">{b.label}</div>
                    <div className="text-xs text-ms-ash">
                      {formatLong(b.startDate)} – {formatLong(b.endDate)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-ms-bone">Activity</h2>
            <ul className="mt-4 space-y-2 text-xs text-ms-fog">
              {activity.length === 0 ? (
                <li className="text-ms-ash">Nothing yet.</li>
              ) : (
                activity.map((e) => (
                  <li key={e.id} className="flex justify-between gap-3">
                    <span>
                      <span className="text-ms-bone">{e.action}</span>
                      {e.detail ? ` · ${e.detail}` : ""}
                    </span>
                    <span className="shrink-0 text-ms-ash">
                      {formatDateTime(e.createdAt)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
