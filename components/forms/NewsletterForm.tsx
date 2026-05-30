"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buttonVariants } from "@/components/ui/button";
import { newsletterFields, type NewsletterInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterFields) });

  const onSubmit = async (data: NewsletterInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", ...data }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="mt-8 max-w-xs text-body-sm text-ms-fog">
        You&apos;re on the list. Welcome aboard.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-8 max-w-xs"
    >
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          className="h-9 w-full rounded-md border border-ms-graphite bg-ms-obsidian px-3 text-body-sm text-ms-bone placeholder:text-ms-ash focus:border-ms-ion focus:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "shrink-0 border-ms-graphite text-ms-bone hover:bg-ms-obsidian disabled:opacity-60",
          )}
        >
          {status === "submitting" ? "…" : "Join"}
        </button>
      </div>
      {errors.email ? (
        <p className="mt-1.5 text-body-sm text-ms-danger">
          {errors.email.message}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-1.5 text-body-sm text-ms-danger">
          Something went wrong. Try again.
        </p>
      ) : null}
    </form>
  );
}
