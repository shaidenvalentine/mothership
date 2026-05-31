"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createBlankOrder } from "./actions";

export function NewOrderButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await createBlankOrder();
          if (res.redirect) router.push(res.redirect);
        })
      }
      className="rounded-md bg-ms-bone px-4 py-2 text-sm font-medium text-ms-black transition hover:bg-ms-paper disabled:opacity-50"
    >
      {pending ? "Creating…" : "+ New order"}
    </button>
  );
}
