"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { Commission, TeamMember } from "@/lib/db/schema";
import { commissionAmountCents } from "@/lib/commission";
import { formatCents } from "@/lib/format";
import { addCommissionAction, removeCommissionAction } from "../actions";

export function CommissionsEditor({
  orderId,
  totalPriceCents,
  costCents,
  lines,
  team,
}: {
  orderId: number;
  totalPriceCents: number;
  costCents: number;
  lines: Commission[];
  team: TeamMember[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState("percent");

  const order = { totalPriceCents, costCents };
  const total = lines.reduce(
    (sum, c) => sum + commissionAmountCents(order, c),
    0,
  );

  return (
    <div className="space-y-4">
      {lines.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {lines.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-md border border-ms-graphite/40 px-3 py-2"
            >
              <span className="text-ms-bone">
                {c.payee}
                <span className="ml-2 text-xs text-ms-ash">
                  {c.kind === "percent"
                    ? `${c.value}% of ${c.basis}`
                    : "flat"}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-ms-success">
                  {formatCents(commissionAmountCents(order, c))}
                </span>
                <button
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm(`Remove the ${c.payee} commission line?`))
                      return;
                    startTransition(async () => {
                      await removeCommissionAction(orderId, c.id);
                      router.refresh();
                    });
                  }}
                  className="text-xs text-ms-ash transition hover:text-ms-danger"
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
          <li className="flex justify-between border-t border-ms-graphite/40 px-3 pt-2 text-sm">
            <span className="text-ms-ash">Total commission</span>
            <span className="text-ms-bone">{formatCents(total)}</span>
          </li>
        </ul>
      ) : (
        <p className="text-xs text-ms-ash">No commission lines yet.</p>
      )}

      <form
        action={(fd) =>
          startTransition(async () => {
            await addCommissionAction(orderId, fd);
            router.refresh();
          })
        }
        className="space-y-3 rounded-md border border-ms-graphite/40 p-3"
      >
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-ms-ash">
            Payee
            <input
              name="payee"
              list="team-list"
              required
              placeholder="Kial"
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-1.5 text-sm text-ms-bone"
            />
            <datalist id="team-list">
              {team.map((m) => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </label>
          <label className="text-xs text-ms-ash">
            Type
            <select
              name="kind"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-1.5 text-sm text-ms-bone"
            >
              <option value="percent">Percent</option>
              <option value="flat">Flat $</option>
            </select>
          </label>
          <label className="text-xs text-ms-ash">
            {kind === "percent" ? "Percent (e.g. 10)" : "Amount ($)"}
            <input
              name="value"
              required
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-1.5 text-sm text-ms-bone"
            />
          </label>
          <label className="text-xs text-ms-ash">
            Of
            <select
              name="basis"
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-1.5 text-sm text-ms-bone"
            >
              <option value="sale">Sale price</option>
              <option value="margin">Margin (price − cost)</option>
            </select>
          </label>
        </div>
        <button
          disabled={pending}
          className="rounded-md border border-ms-graphite px-3 py-1.5 text-xs text-ms-bone transition hover:border-ms-bone disabled:opacity-50"
        >
          Add commission line
        </button>
      </form>
    </div>
  );
}
