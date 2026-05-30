"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buttonVariants } from "@/components/ui/button";
import { reserveFields, type ReserveInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { errorClass, inputClass, labelClass } from "./field-styles";

const timelines = [
  "As soon as possible",
  "3–6 months",
  "6–12 months",
  "12+ months",
  "Just exploring",
];

interface ReserveFormProps {
  /** A configured build spec to attach to the reservation, if any. */
  presetMessage?: string;
}

export function ReserveForm({ presetMessage }: ReserveFormProps = {}) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReserveInput>({ resolver: zodResolver(reserveFields) });

  const onSubmit = async (data: ReserveInput) => {
    setStatus("submitting");
    try {
      // Attach the configured build spec without clobbering the user's note.
      const message = [presetMessage, data.message]
        .filter(Boolean)
        .join("\n\n");
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reserve", ...data, message }),
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
          Reservation received.
        </h3>
        <p className="mt-3 text-body text-ms-fog">
          Shaiden will reach out to set up your discovery call. Keep an eye on
          your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input id="name" className={inputClass} {...register("name")} />
          {errors.name ? <p className={errorClass}>{errors.name.message}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className={errorClass}>{errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className={inputClass}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className={errorClass}>{errors.phone.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="timeline">
            Timeline
          </label>
          <select
            id="timeline"
            className={inputClass}
            defaultValue=""
            {...register("timeline")}
          >
            <option value="" disabled>
              Select…
            </option>
            {timelines.map((t) => (
              <option key={t} value={t} className="bg-ms-obsidian">
                {t}
              </option>
            ))}
          </select>
          {errors.timeline ? (
            <p className={errorClass}>{errors.timeline.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="useCase">
          How will you use it?
        </label>
        <input
          id="useCase"
          className={inputClass}
          placeholder="Full-time living, weekend adventures, business…"
          {...register("useCase")}
        />
        {errors.useCase ? (
          <p className={errorClass}>{errors.useCase.message}</p>
        ) : null}
      </div>

      {presetMessage ? (
        <div className="rounded-xl border border-ms-ion/40 bg-ms-ion/5 p-5">
          <span className="ms-caption text-ms-ion">Your build</span>
          <ul className="mt-3 space-y-1">
            {presetMessage.split("\n").filter(Boolean).map((line) => (
              <li key={line} className="text-body-sm text-ms-bone">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-body-sm text-ms-ash">
            Attached to your reservation. Adjust it any time above.
          </p>
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="message">
          Anything else? <span className="text-ms-ash">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
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
        {status === "submitting" ? "Sending…" : "Reserve your build"}
      </button>
    </form>
  );
}
