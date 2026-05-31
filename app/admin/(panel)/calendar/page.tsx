import { getAvailability } from "@/lib/availability";
import { listBookings } from "@/lib/db/queries";
import { formatLong } from "@/lib/dates";
import { Badge, BOOKING_STATUS_TONE } from "../_components/badges";
import { addBookingAction } from "./actions";
import { BookingActions } from "./BookingActions";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [bookings, availability] = await Promise.all([
    listBookings(),
    getAvailability(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.endDate >= today);
  const past = bookings.filter((b) => b.endDate < today);

  return (
    <div className="max-w-4xl">
      <span className="ms-caption">Demo van</span>
      <h1 className="mt-2 font-display text-display-md text-ms-bone">
        Rental calendar
      </h1>
      <p className="mt-3 max-w-xl text-body text-ms-fog">
        Block dates, approve creator requests, and check what&rsquo;s open. The
        public /creators calendar reflects these immediately. Open season:{" "}
        {formatLong(availability.applicationWindow.start)} –{" "}
        {formatLong(availability.applicationWindow.end)}.
      </p>

      {/* Add booking */}
      <form
        action={addBookingAction}
        className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-ms-graphite/60 bg-ms-obsidian p-6 sm:grid-cols-5"
      >
        <label className="text-xs text-ms-ash">
          Start
          <input
            type="date"
            name="start"
            required
            className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-2 text-sm text-ms-bone"
          />
        </label>
        <label className="text-xs text-ms-ash">
          End
          <input
            type="date"
            name="end"
            required
            className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-2 text-sm text-ms-bone"
          />
        </label>
        <label className="text-xs text-ms-ash">
          Status
          <select
            name="status"
            className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-2 text-sm text-ms-bone"
          >
            <option value="booked">Booked</option>
            <option value="held">Held</option>
          </select>
        </label>
        <label className="col-span-2 text-xs text-ms-ash sm:col-span-1">
          Label
          <input
            name="label"
            placeholder="e.g. SEMA Show"
            className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-2 py-2 text-sm text-ms-bone"
          />
        </label>
        <div className="col-span-2 flex items-end sm:col-span-1">
          <button className="w-full rounded-md bg-ms-bone px-4 py-2 text-sm font-medium text-ms-black transition hover:bg-ms-paper">
            Add
          </button>
        </div>
      </form>

      <BookingTable
        title="Upcoming & active"
        rows={upcoming}
        emptyText="No upcoming bookings — the calendar is wide open."
      />
      {past.length > 0 ? (
        <BookingTable title="Past" rows={past} muted />
      ) : null}
    </div>
  );
}

function BookingTable({
  title,
  rows,
  emptyText,
  muted,
}: {
  title: string;
  rows: Awaited<ReturnType<typeof listBookings>>;
  emptyText?: string;
  muted?: boolean;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl text-ms-bone">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-ms-graphite/60">
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ms-ash">
            {emptyText ?? "Nothing here."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <tbody>
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className={`border-b border-ms-graphite/30 ${muted ? "opacity-60" : ""}`}
                >
                  <td className="px-5 py-3">
                    <div className="text-ms-bone">{b.label}</div>
                    {b.customerEmail ? (
                      <div className="text-xs text-ms-ash">
                        {b.customerEmail}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 text-ms-fog">
                    {formatLong(b.startDate)} – {formatLong(b.endDate)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={BOOKING_STATUS_TONE[b.status]}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <BookingActions id={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
