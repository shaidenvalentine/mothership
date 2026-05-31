import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/admin") ? next : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-ms-black px-6">
      <LoginForm next={safeNext} />
    </main>
  );
}
