"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ApplicationStatus } from "@/lib/db/schema";
import {
  approveApplication,
  saveApplicationNotes,
  setApplicationStatus,
} from "../actions";

export function ApplicationActions({
  id,
  status,
  notes,
}: {
  id: number;
  status: ApplicationStatus;
  notes: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [noteValue, setNoteValue] = useState(notes);
  const [saved, setSaved] = useState(false);

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          disabled={pending || status === "approved"}
          onClick={() =>
            startTransition(async () => {
              const res = await approveApplication(id);
              if (res.redirect) router.push(res.redirect);
              else router.refresh();
            })
          }
          className="rounded-md bg-ms-success/90 px-4 py-2 text-sm font-medium text-ms-black transition hover:bg-ms-success disabled:opacity-50"
        >
          Approve
        </button>
        <button
          disabled={pending}
          onClick={() => run(() => setApplicationStatus(id, "reviewing"))}
          className="rounded-md border border-ms-graphite px-4 py-2 text-sm text-ms-bone transition hover:border-ms-bone disabled:opacity-50"
        >
          Mark reviewing
        </button>
        <button
          disabled={pending}
          onClick={() => run(() => setApplicationStatus(id, "rejected"))}
          className="rounded-md border border-ms-danger/50 px-4 py-2 text-sm text-ms-danger transition hover:border-ms-danger disabled:opacity-50"
        >
          Reject
        </button>
        <button
          disabled={pending}
          onClick={() => run(() => setApplicationStatus(id, "archived"))}
          className="rounded-md border border-ms-graphite px-4 py-2 text-sm text-ms-ash transition hover:text-ms-bone disabled:opacity-50"
        >
          Archive
        </button>
      </div>

      <div>
        <label className="text-sm text-ms-fog" htmlFor="notes">
          Internal notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={noteValue}
          onChange={(e) => {
            setNoteValue(e.target.value);
            setSaved(false);
          }}
          className="mt-2 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
        />
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveApplicationNotes(id, noteValue);
              setSaved(true);
            })
          }
          className="mt-2 rounded-md border border-ms-graphite px-3 py-1.5 text-xs text-ms-bone transition hover:border-ms-bone disabled:opacity-50"
        >
          {saved ? "Saved ✓" : "Save notes"}
        </button>
      </div>
    </div>
  );
}
