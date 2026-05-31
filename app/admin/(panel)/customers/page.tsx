import Link from "next/link";

import { listApplications, listOrders } from "@/lib/db/queries";
import { formatCents, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

interface Customer {
  email: string;
  name: string;
  phone?: string;
  applications: number;
  orders: number;
  lastSeen: Date;
  hasOrder: boolean;
}

export default async function CustomersPage() {
  const [apps, orders] = await Promise.all([listApplications(), listOrders()]);

  const map = new Map<string, Customer>();
  const touch = (email: string, name: string, phone: string | null, when: Date) => {
    const key = email.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      if (when > existing.lastSeen) existing.lastSeen = when;
      if (!existing.name && name) existing.name = name;
      if (!existing.phone && phone) existing.phone = phone;
      return existing;
    }
    const c: Customer = {
      email,
      name,
      phone: phone ?? undefined,
      applications: 0,
      orders: 0,
      lastSeen: when,
      hasOrder: false,
    };
    map.set(key, c);
    return c;
  };

  for (const a of apps) {
    if (!a.email) continue;
    const c = touch(a.email, a.name ?? "", a.phone, a.createdAt);
    c.applications += 1;
  }
  for (const o of orders) {
    if (!o.customerEmail) continue;
    const c = touch(o.customerEmail, o.customerName, o.customerPhone, o.createdAt);
    c.orders += 1;
    c.hasOrder = true;
  }

  const customers = [...map.values()].sort(
    (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime(),
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPriceCents, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="ms-caption">CRM</span>
          <h1 className="mt-2 font-display text-display-md text-ms-bone">
            Customers
          </h1>
        </div>
        <a
          href="/api/admin/export?type=customers"
          className="rounded-md border border-ms-graphite px-4 py-2 text-sm text-ms-bone transition hover:border-ms-bone"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 flex gap-6 text-sm text-ms-fog">
        <span>{customers.length} contacts</span>
        <span>{orders.length} orders</span>
        <span>Pipeline value {formatCents(totalRevenue)}</span>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-ms-graphite/60">
        {customers.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ms-ash">
            No contacts yet.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ms-graphite/60 text-xs uppercase tracking-wide text-ms-ash">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Apps</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.email}
                  className="border-b border-ms-graphite/30 hover:bg-ms-obsidian"
                >
                  <td className="px-5 py-3 text-ms-bone">
                    {c.name || "—"}
                    {c.hasOrder ? (
                      <span className="ml-2 text-xs text-ms-ion">buyer</span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/applications?status=`}
                      className="text-ms-fog hover:text-ms-ion"
                    >
                      {c.email}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ms-fog">{c.applications}</td>
                  <td className="px-5 py-3 text-ms-fog">{c.orders}</td>
                  <td className="px-5 py-3 text-ms-ash">
                    {formatDate(c.lastSeen)}
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
