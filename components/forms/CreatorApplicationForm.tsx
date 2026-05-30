"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buttonVariants } from "@/components/ui/button";
import { creatorFields, type CreatorInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { errorClass, inputClass, labelClass } from "./field-styles";

export function CreatorApplicationForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatorInput>({ resolver: zodResolver(creatorFields) });

  const onSubmit = async (data: CreatorInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "creator", ...data }),
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
          Application received.
        </h3>
        <p className="mt-3 text-body text-ms-fog">
          Shaiden will review your trip and reach out within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-12">
      {/* Who you are */}
      <fieldset className="space-y-6">
        <legend className="ms-caption text-ms-ion">Who you are</legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="cr-name">
              Name
            </label>
            <input id="cr-name" className={inputClass} {...register("name")} />
            {errors.name ? (
              <p className={errorClass}>{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cr-email">
              Email
            </label>
            <input
              id="cr-email"
              type="email"
              className={inputClass}
              {...register("email")}
            />
            {errors.email ? (
              <p className={errorClass}>{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cr-instagram">
              Instagram
            </label>
            <input
              id="cr-instagram"
              placeholder="@handle"
              className={inputClass}
              {...register("instagram")}
            />
            {errors.instagram ? (
              <p className={errorClass}>{errors.instagram.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cr-youtube">
              YouTube <span className="text-ms-ash">(optional)</span>
            </label>
            <input
              id="cr-youtube"
              placeholder="Channel URL or @handle"
              className={inputClass}
              {...register("youtube")}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-following">
            Total following across platforms{" "}
            <span className="text-ms-ash">(optional)</span>
          </label>
          <input
            id="cr-following"
            placeholder="e.g. 120K combined IG + YouTube + TikTok"
            className={inputClass}
            {...register("totalFollowing")}
          />
        </div>
      </fieldset>

      {/* The trip */}
      <fieldset className="space-y-6">
        <legend className="ms-caption text-ms-ion">The trip</legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="cr-pickup">
              Pickup date
            </label>
            <input
              id="cr-pickup"
              type="date"
              className={inputClass}
              {...register("pickupDate")}
            />
            {errors.pickupDate ? (
              <p className={errorClass}>{errors.pickupDate.message}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cr-return">
              Return date
            </label>
            <input
              id="cr-return"
              type="date"
              className={inputClass}
              {...register("returnDate")}
            />
            {errors.returnDate ? (
              <p className={errorClass}>{errors.returnDate.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-destination">
            Where are you going?
          </label>
          <input
            id="cr-destination"
            className={inputClass}
            placeholder="Joshua Tree, Big Sur, Banff…"
            {...register("destination")}
          />
          {errors.destination ? (
            <p className={errorClass}>{errors.destination.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-plan">
            What will you create?
          </label>
          <textarea
            id="cr-plan"
            rows={5}
            className={inputClass}
            placeholder="A quick sketch of the content — Reels, a YouTube short, a long-form trip film, photo set…"
            {...register("contentPlan")}
          />
          {errors.contentPlan ? (
            <p className={errorClass}>{errors.contentPlan.message}</p>
          ) : null}
        </div>
      </fieldset>

      {/* Agree */}
      <div className="rounded-xl border border-ms-graphite/70 bg-ms-obsidian p-6">
        <label className="flex items-start gap-3 text-body-sm text-ms-fog">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-ms-ion"
            {...register("agreeRules")}
          />
          <span>
            I&apos;ve read the house rules above and will treat the demo van
            accordingly — no heavy off-roading, no towing, smoke-free, returned
            cleaner than I got it.
          </span>
        </label>
        {errors.agreeRules ? (
          <p className={errorClass}>{errors.agreeRules.message}</p>
        ) : null}
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
        {status === "submitting" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
