"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buttonVariants } from "@/components/ui/button";
import { events } from "@/content/events";
import { viewingFields, type ViewingInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { errorClass, inputClass, labelClass } from "./field-styles";

const PRIVATE_OPTION = "A private viewing (other date)";

export function ViewingForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ViewingInput>({ resolver: zodResolver(viewingFields) });

  const onSubmit = async (data: ViewingInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "viewing", ...data }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-ms-graphite/70 bg-ms-obsidian p-10 text-center">
        <h3 className="font-display text-display-md text-ms-bone">
          Request received.
        </h3>
        <p className="mt-3 text-body text-ms-fog">
          We&rsquo;ll confirm a time to get you in front of the van. Watch your
          inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="v-name">
            Name
          </label>
          <input id="v-name" className={inputClass} {...register("name")} />
          {errors.name ? (
            <p className={errorClass}>{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="v-email">
            Email
          </label>
          <input
            id="v-email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className={errorClass}>{errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="v-phone">
            Phone <span className="text-ms-ash">(optional)</span>
          </label>
          <input
            id="v-phone"
            type="tel"
            className={inputClass}
            {...register("phone")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="v-date">
            Preferred date <span className="text-ms-ash">(optional)</span>
          </label>
          <input
            id="v-date"
            type="date"
            className={inputClass}
            {...register("preferredDate")}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="v-event">
          Where would you like to see it?
        </label>
        <select
          id="v-event"
          className={inputClass}
          defaultValue=""
          {...register("event")}
        >
          <option value="" disabled>
            Select…
          </option>
          {events
            .filter((e) => e.appointments)
            .map((e) => (
              <option key={e.id} value={`${e.name} — ${e.city}`} className="bg-ms-obsidian">
                {e.name} — {e.city}
              </option>
            ))}
          <option value={PRIVATE_OPTION} className="bg-ms-obsidian">
            {PRIVATE_OPTION}
          </option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="v-message">
          Anything else? <span className="text-ms-ash">(optional)</span>
        </label>
        <textarea
          id="v-message"
          rows={4}
          className={inputClass}
          placeholder="What you'd like to see or test, how many of you, timing…"
          {...register("message")}
        />
      </div>

      {status === "error" ? (
        <p className={errorClass}>
          Something went wrong. Please try again or email brandon@bucksd.com.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(
          buttonVariants({ size: "lg" }),
          "rounded-full bg-ms-bone px-8 text-ms-black hover:bg-ms-paper disabled:opacity-60",
        )}
      >
        {status === "submitting" ? "Sending…" : "Request a viewing"}
      </button>
    </form>
  );
}
