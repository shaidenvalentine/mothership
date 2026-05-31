import { cn } from "@/lib/utils";

const TONE = {
  neutral: "border-ms-graphite text-ms-fog",
  blue: "border-ms-ion/50 text-ms-ion",
  amber: "border-ms-warning/50 text-ms-warning",
  green: "border-ms-success/50 text-ms-success",
  red: "border-ms-danger/50 text-ms-danger",
} as const;

type Tone = keyof typeof TONE;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}

export const APPLICATION_TYPE_LABEL: Record<string, string> = {
  reserve: "Reservation",
  consultation: "Consultation",
  creator: "Creator",
  viewing: "Viewing",
  newsletter: "Newsletter",
};

export const APPLICATION_STATUS_TONE: Record<string, Tone> = {
  new: "blue",
  reviewing: "amber",
  approved: "green",
  rejected: "red",
  archived: "neutral",
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  deposit_pending: "Deposit pending",
  deposit_paid: "Deposit paid",
  in_build: "In build",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_TONE: Record<string, Tone> = {
  deposit_pending: "amber",
  deposit_paid: "blue",
  in_build: "blue",
  ready: "green",
  delivered: "green",
  cancelled: "red",
};

export const BOOKING_STATUS_TONE: Record<string, Tone> = {
  booked: "blue",
  held: "amber",
  pending: "amber",
};

export const PIPELINE_STAGE_TONE: Record<string, Tone> = {
  "Cold lead": "neutral",
  Contacted: "neutral",
  Qualified: "blue",
  Consultation: "blue",
  "Quote sent": "amber",
  "Deposit paid": "blue",
  "In build": "blue",
  Ready: "green",
  Delivered: "green",
  Lost: "red",
};
