"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setPipelineSourced } from "../actions";

export function PipelineSourcedToggle({
  orderId,
  value,
}: {
  orderId: number;
  value: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-ms-fog">
      <input
        type="checkbox"
        defaultChecked={value}
        disabled={pending}
        onChange={(e) =>
          startTransition(async () => {
            await setPipelineSourced(orderId, e.target.checked);
            router.refresh();
          })
        }
      />
      Pipeline-sourced (qualifies Kial&rsquo;s setting commission)
    </label>
  );
}
