import type { Metadata } from "next";
import Link from "next/link";

import { isDbConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mothership Ops",
  robots: { index: false, follow: false },
};
import { logoutAction } from "../actions";
import { AdminNav } from "./AdminNav";

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dbReady = isDbConfigured();

  return (
    <div className="min-h-screen bg-ms-black text-ms-bone">
      <div className="mx-auto flex max-w-[100rem] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 border-b border-ms-graphite/60 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:sticky lg:top-0">
          <div className="flex items-center justify-between px-6 py-6">
            <Link href="/admin" className="block">
              <span className="ms-caption">Mothership</span>
              <span className="block font-display text-xl text-ms-bone">
                Ops
              </span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs text-ms-ash transition hover:text-ms-bone"
              >
                Sign out
              </button>
            </form>
          </div>
          <AdminNav />
          <div className="hidden px-6 pb-6 lg:block">
            <Link
              href="/"
              className="text-xs text-ms-ash transition hover:text-ms-bone"
            >
              ← View live site
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10">
          {!dbReady ? (
            <div className="mb-8 rounded-lg border border-ms-warning/40 bg-ms-warning/10 px-5 py-4 text-sm text-ms-bone">
              <strong className="text-ms-warning">
                Database not connected.
              </strong>{" "}
              Set <code className="font-mono">DATABASE_URL</code> (run{" "}
              <code className="font-mono">vercel env pull .env.local</code> then{" "}
              <code className="font-mono">pnpm db:push</code>) to enable
              applications, orders and the calendar. The live marketing site
              keeps working without it.
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
