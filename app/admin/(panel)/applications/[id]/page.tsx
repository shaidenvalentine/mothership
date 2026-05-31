import Link from "next/link";
import { notFound } from "next/navigation";

import { getApplication } from "@/lib/db/queries";
import { formatDateTime } from "@/lib/format";
import {
  APPLICATION_STATUS_TONE,
  APPLICATION_TYPE_LABEL,
  Badge,
} from "../../_components/badges";
import { ApplicationActions } from "./ApplicationActions";

export const dynamic = "force-dynamic";

/** Human labels for the type-specific `data` jsonb keys. */
const FIELD_LABEL: Record<string, string> = {
  timeline: "Timeline",
  useCase: "Use case",
  message: "Message",
  instagram: "Instagram",
  youtube: "YouTube",
  totalFollowing: "Total following",
  pickupDate: "Pickup date",
  returnDate: "Return date",
  destination: "Destination",
  contentPlan: "Content plan",
  event: "Event / where",
  preferredDate: "Preferred date",
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getApplication(Number(id));
  if (!app) notFound();

  const entries = Object.entries(app.data ?? {}).filter(
    ([, v]) => v !== "" && v != null,
  );

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/applications"
        className="text-sm text-ms-ash transition hover:text-ms-bone"
      >
        ← All applications
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <h1 className="font-display text-display-md text-ms-bone">
          {app.name ?? app.email}
        </h1>
        <Badge tone={APPLICATION_STATUS_TONE[app.status]}>{app.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-ms-ash">
        {APPLICATION_TYPE_LABEL[app.type] ?? app.type} ·{" "}
        {formatDateTime(app.createdAt)}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Details */}
        <div className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-ms-ash">Email</dt>
              <dd className="text-ms-bone">
                <a href={`mailto:${app.email}`} className="hover:text-ms-ion">
                  {app.email}
                </a>
              </dd>
            </div>
            {app.phone ? (
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ms-ash">Phone</dt>
                <dd className="text-ms-bone">{app.phone}</dd>
              </div>
            ) : null}
            {entries.map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <dt className="w-32 shrink-0 text-ms-ash">
                  {FIELD_LABEL[key] ?? key}
                </dt>
                <dd className="whitespace-pre-wrap text-ms-bone">
                  {String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Actions */}
        <div className="rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
          <ApplicationActions
            id={app.id}
            status={app.status}
            notes={app.adminNotes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
