import { getAvailability } from "@/lib/availability";
import { SubmitButton } from "../_components/SubmitButton";
import { getDealConfig } from "@/lib/deal-config";
import {
  ensureDefaultTeam,
  getSetting,
  listTeamMembers,
} from "@/lib/db/queries";
import {
  addTeamMemberAction,
  saveCommissionConfig,
  saveDeposit,
  saveLeadSources,
  saveProductConfig,
  saveTiers,
  saveWindow,
  toggleTeamMemberAction,
} from "./actions";

export const dynamic = "force-dynamic";

const DEFAULT_SOURCES = [
  "instagram",
  "youtube",
  "tiktok",
  "referral",
  "event",
  "paid",
  "website",
  "direct",
];

export default async function SettingsPage() {
  await ensureDefaultTeam();
  const availability = await getAvailability();
  const depositPercent = (await getSetting<number>("depositPercent")) ?? 50;
  const team = await listTeamMembers();
  const sources =
    (await getSetting<string[]>("leadSources")) ?? DEFAULT_SOURCES;
  const dealConfig = await getDealConfig();

  return (
    <div className="max-w-3xl">
      <span className="ms-caption">Configuration</span>
      <h1 className="mt-2 font-display text-display-md text-ms-bone">Settings</h1>

      {/* Application window */}
      <section className="mt-8 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">
          Creator application window
        </h2>
        <p className="mt-1 text-xs text-ms-ash">
          The open season shown on the public /creators calendar.
        </p>
        <form action={saveWindow} className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-xs text-ms-ash">
            Start
            <input
              type="date"
              name="start"
              defaultValue={availability.applicationWindow.start}
              className="mt-1 block rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone"
            />
          </label>
          <label className="text-xs text-ms-ash">
            End
            <input
              type="date"
              name="end"
              defaultValue={availability.applicationWindow.end}
              className="mt-1 block rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone"
            />
          </label>
          <SubmitButton>Save window</SubmitButton>
        </form>
      </section>

      {/* Deposit */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Deposit</h2>
        <form action={saveDeposit} className="mt-4 flex items-end gap-4">
          <label className="text-xs text-ms-ash">
            Default deposit (%)
            <input
              type="number"
              name="depositPercent"
              min={0}
              max={100}
              defaultValue={depositPercent}
              className="mt-1 block w-28 rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone"
            />
          </label>
          <SubmitButton>Save</SubmitButton>
        </form>
      </section>

      {/* Content tiers */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">
          Creator content expectations
        </h2>
        <p className="mt-1 text-xs text-ms-ash">
          Advanced — edit the tier structure as JSON. Shown on /creators when a
          trip length is picked.
        </p>
        <form action={saveTiers} className="mt-4 space-y-4">
          <label className="block text-xs text-ms-ash">
            Content tiers (JSON array)
            <textarea
              name="contentTiers"
              rows={8}
              defaultValue={JSON.stringify(availability.contentTiers, null, 2)}
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
            />
          </label>
          <label className="block text-xs text-ms-ash">
            Always expected (JSON array of strings)
            <textarea
              name="alwaysExpected"
              rows={4}
              defaultValue={JSON.stringify(availability.alwaysExpected, null, 2)}
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
            />
          </label>
          <SubmitButton jsonFields={["contentTiers", "alwaysExpected"]}>
            Save expectations
          </SubmitButton>
        </form>
      </section>

      {/* Products & pricing */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Products &amp; pricing</h2>
        <p className="mt-1 text-xs text-ms-ash">
          The two SKUs and the add-on menu (prices in cents). Used by the deal
          configurator to set sale price and build cost.
        </p>
        <form action={saveProductConfig} className="mt-4 space-y-4">
          <label className="block text-xs text-ms-ash">
            SKUs (JSON)
            <textarea
              name="skus"
              rows={6}
              defaultValue={JSON.stringify(dealConfig.skus, null, 2)}
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
            />
          </label>
          <label className="block text-xs text-ms-ash">
            Add-on menu (JSON array of {"{ name, priceCents }"})
            <textarea
              name="addOns"
              rows={5}
              defaultValue={JSON.stringify(dealConfig.addOns, null, 2)}
              className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
            />
          </label>
          <SubmitButton jsonFields={["skus", "addOns"]}>
            Save products
          </SubmitButton>
        </form>
      </section>

      {/* Commission rules */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Commission rules</h2>
        <p className="mt-1 text-xs text-ms-ash">
          The Phase-1 deal: closing (Shaiden), setting (Kial, pipeline-sourced
          only), and brand royalty (flat). Tiers are by van number per calendar
          year. Edit as JSON.
        </p>
        <form action={saveCommissionConfig} className="mt-4 space-y-3">
          <textarea
            name="commissionConfig"
            rows={14}
            defaultValue={JSON.stringify(dealConfig.commission, null, 2)}
            className="w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
          />
          <SubmitButton jsonFields={["commissionConfig"]}>
            Save commission rules
          </SubmitButton>
        </form>
      </section>

      {/* Team members */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Team</h2>
        <p className="mt-1 text-xs text-ms-ash">
          Deal owners and commission payees (Kial, Shaiden, Brandon).
        </p>
        <ul className="mt-4 space-y-2">
          {team.map((m) => {
            const toggle = toggleTeamMemberAction.bind(null, m.id, !m.active);
            return (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-md border border-ms-graphite/40 px-3 py-2 text-sm"
              >
                <span className={m.active ? "text-ms-bone" : "text-ms-ash line-through"}>
                  {m.name}
                  {m.role ? (
                    <span className="ml-2 text-xs text-ms-ash">{m.role}</span>
                  ) : null}
                </span>
                <form action={toggle}>
                  <button className="text-xs text-ms-ash transition hover:text-ms-bone">
                    {m.active ? "Deactivate" : "Reactivate"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
        <form action={addTeamMemberAction} className="mt-4 flex flex-wrap gap-2">
          <input
            name="name"
            placeholder="Name"
            required
            className="rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone"
          />
          <input
            name="role"
            placeholder="Role (optional)"
            className="flex-1 rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone"
          />
          <SubmitButton pendingLabel="Adding…">Add member</SubmitButton>
        </form>
      </section>

      {/* Lead sources */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Lead sources</h2>
        <p className="mt-1 text-xs text-ms-ash">
          The source options used for attribution (one per line). Forms also
          auto-tag UTM/referrer.
        </p>
        <form action={saveLeadSources} className="mt-4">
          <textarea
            name="sources"
            rows={6}
            defaultValue={sources.join("\n")}
            className="w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 font-mono text-xs text-ms-bone"
          />
          <span className="mt-2 inline-block">
            <SubmitButton>Save sources</SubmitButton>
          </span>
        </form>
      </section>

      {/* Auth note */}
      <section className="mt-6 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6">
        <h2 className="font-display text-xl text-ms-bone">Access</h2>
        <p className="mt-2 text-sm text-ms-fog">
          Admin sign-in uses a shared password. Rotate it by changing{" "}
          <code className="font-mono text-ms-ion">ADMIN_PASSWORD</code> in the
          Vercel project env vars (and{" "}
          <code className="font-mono text-ms-ion">ADMIN_SESSION_SECRET</code> to
          force everyone to re-login).
        </p>
      </section>
    </div>
  );
}
