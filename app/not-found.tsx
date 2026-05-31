import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ms-black px-6 text-center">
      <span className="ms-caption text-ms-ion">404</span>
      <h1 className="mt-6 max-w-2xl font-display text-display-xl leading-[1.02] text-ms-bone">
        This road doesn&rsquo;t exist.
      </h1>
      <p className="mt-6 max-w-md text-body-lg text-ms-fog">
        The page you&rsquo;re looking for isn&rsquo;t here. Let&rsquo;s get you
        back on course.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
        >
          Back to home
        </Link>
        <Link
          href="/configure"
          className="rounded-md border border-ms-graphite px-6 py-3 text-ms-bone transition hover:border-ms-bone"
        >
          Reserve a Mothership
        </Link>
      </div>
    </main>
  );
}
