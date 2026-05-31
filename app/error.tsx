"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ms-black px-6 text-center">
      <span className="ms-caption text-ms-ion">Something went wrong</span>
      <h1 className="mt-6 max-w-2xl font-display text-display-lg leading-[1.05] text-ms-bone">
        We hit an unexpected bump.
      </h1>
      <p className="mt-6 max-w-md text-body-lg text-ms-fog">
        Try again — and if it keeps happening, reach us at{" "}
        <a
          href="mailto:shaidenvalentine@gmail.com"
          className="text-ms-bone underline-offset-4 hover:underline"
        >
          shaidenvalentine@gmail.com
        </a>
        .
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-ms-bone px-6 py-3 font-medium text-ms-black transition hover:bg-ms-paper"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-ms-graphite px-6 py-3 text-ms-bone transition hover:border-ms-bone"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
