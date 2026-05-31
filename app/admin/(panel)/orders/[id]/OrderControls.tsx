"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  BUILD_STAGES,
  PIPELINE_STAGES,
  type BuildStage,
  type PipelineStage,
} from "@/lib/db/schema";
import { setDealStage, setOrderStage } from "../actions";

export function OrderControls({
  id,
  pipelineStage,
  stage,
  trackerUrl,
}: {
  id: number;
  pipelineStage: PipelineStage;
  stage: BuildStage;
  trackerUrl: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-ms-ash">Pipeline stage</label>
        <select
          value={pipelineStage}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value as PipelineStage;
            let reason: string | undefined;
            if (next === "Lost") {
              reason = window.prompt("Reason this deal was lost?") ?? "";
            }
            startTransition(async () => {
              await setDealStage(id, next, reason);
              router.refresh();
            });
          }}
          className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
        >
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-ms-ash">
          Build stage (shown on customer tracker)
        </label>
        <select
          defaultValue={stage}
          disabled={pending}
          onChange={(e) =>
            startTransition(async () => {
              await setOrderStage(id, e.target.value as BuildStage);
              router.refresh();
            })
          }
          className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
        >
          {BUILD_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-ms-ash">Customer tracker link</label>
        <div className="mt-1 flex gap-2">
          <input
            readOnly
            value={trackerUrl}
            className="min-w-0 flex-1 rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-xs text-ms-fog outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(trackerUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-md border border-ms-graphite px-3 py-2 text-xs text-ms-bone transition hover:border-ms-bone"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <a
          href={trackerUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-xs text-ms-ion hover:underline"
        >
          Open tracker ↗
        </a>
      </div>
    </div>
  );
}
