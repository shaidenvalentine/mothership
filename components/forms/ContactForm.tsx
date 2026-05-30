"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buttonVariants } from "@/components/ui/button";
import { consultationFields, type ConsultationInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { errorClass, inputClass, labelClass } from "./field-styles";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationFields),
  });

  const onSubmit = async (data: ConsultationInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consultation", ...data }),
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
          Message sent.
        </h3>
        <p className="mt-3 text-body text-ms-fog">
          Shaiden will be in touch shortly to set up your discovery call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="c-name">
            Name
          </label>
          <input id="c-name" className={inputClass} {...register("name")} />
          {errors.name ? <p className={errorClass}>{errors.name.message}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className={errorClass}>{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="c-phone">
          Phone <span className="text-ms-ash">(optional)</span>
        </label>
        <input
          id="c-phone"
          type="tel"
          className={inputClass}
          {...register("phone")}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="c-message">
          Message
        </label>
        <textarea
          id="c-message"
          rows={5}
          className={inputClass}
          placeholder="Tell us a little about what you're looking for."
          {...register("message")}
        />
        {errors.message ? (
          <p className={errorClass}>{errors.message.message}</p>
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
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
