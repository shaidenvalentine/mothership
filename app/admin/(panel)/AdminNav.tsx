"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/orders", label: "Pipeline" },
  { href: "/admin/performance", label: "Performance" },
  { href: "/admin/calendar", label: "Rental calendar" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="px-3 pb-6">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition",
              active
                ? "bg-ms-graphite text-ms-bone"
                : "text-ms-fog hover:bg-ms-obsidian hover:text-ms-bone",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
