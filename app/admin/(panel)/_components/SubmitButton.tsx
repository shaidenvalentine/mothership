"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  /** Visual style. */
  variant?: "primary" | "outline" | "danger" | "link";
  className?: string;
  /** If set, window.confirm() with this message before submitting. */
  confirm?: string;
  /** Names of fields in the same form whose values must be valid JSON. */
  jsonFields?: string[];
  pendingLabel?: string;
}

/**
 * Server-action form submit button with a built-in pending state (via
 * useFormStatus), optional confirm-before-submit, and optional client-side
 * JSON validation so malformed pastes don't silently no-op on the server.
 */
export function SubmitButton({
  children,
  variant = "outline",
  className,
  confirm,
  jsonFields,
  pendingLabel = "Saving…",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [error, setError] = useState<string | null>(null);

  const base = "transition disabled:opacity-50";
  const styles = {
    primary:
      "rounded-md px-4 py-2 text-sm font-medium bg-ms-bone text-ms-black hover:bg-ms-paper",
    outline:
      "rounded-md px-4 py-2 text-sm font-medium border border-ms-graphite text-ms-bone hover:border-ms-bone",
    danger:
      "rounded-md px-4 py-2 text-sm font-medium border border-ms-danger/50 text-ms-danger hover:border-ms-danger",
    link: "text-xs text-ms-ash hover:text-ms-danger",
  }[variant];

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setError(null);
    if (confirm && !window.confirm(confirm)) {
      e.preventDefault();
      return;
    }
    if (jsonFields?.length) {
      const form = e.currentTarget.form;
      for (const name of jsonFields) {
        const field = form?.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        if (!field) continue;
        try {
          JSON.parse(field.value);
        } catch {
          e.preventDefault();
          setError(`"${name}" is not valid JSON — fix it before saving.`);
          return;
        }
      }
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="submit"
        disabled={pending}
        onClick={handleClick}
        className={cn(base, styles, className)}
      >
        {pending ? pendingLabel : children}
      </button>
      {error ? <span className="text-xs text-ms-danger">{error}</span> : null}
    </span>
  );
}
