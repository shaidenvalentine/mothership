"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { BookingStatus } from "@/lib/db/schema";
import {
  approveBookingAction,
  deleteBookingAction,
  setBookingStatus,
} from "./actions";

export function BookingActions({
  id,
  status,
}: {
  id: number;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {status === "pending" ? (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await approveBookingAction(id);
              if (res.conflict) setError(res.conflict);
              else {
                setError(null);
                router.refresh();
              }
            })
          }
          className="rounded border border-ms-success/50 px-2 py-1 text-xs text-ms-success transition hover:border-ms-success disabled:opacity-50"
        >
          Approve
        </button>
      ) : (
        <select
          defaultValue={status}
          disabled={pending}
          onChange={(e) =>
            startTransition(async () => {
              await setBookingStatus(id, e.target.value as BookingStatus);
              router.refresh();
            })
          }
          className="rounded border border-ms-graphite bg-ms-black px-2 py-1 text-xs text-ms-bone"
        >
          <option value="booked">Booked</option>
          <option value="held">Held</option>
          <option value="pending">Pending</option>
        </select>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Delete this booking? This can't be undone."))
            return;
          startTransition(async () => {
            await deleteBookingAction(id);
            router.refresh();
          });
        }}
        className="rounded border border-ms-graphite px-2 py-1 text-xs text-ms-ash transition hover:text-ms-danger disabled:opacity-50"
      >
        Delete
      </button>
      {error ? (
        <span className="text-xs text-ms-danger" title={error}>
          ⚠ conflict
        </span>
      ) : null}
    </div>
  );
}
