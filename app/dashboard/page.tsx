import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateEventModal } from "@/components/CreateEventModal";
import { formatDateShort } from "@/lib/utils/date";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { CalendarIcon, ChevronRightIcon, Icon, SparkleIcon } from "@/components/icons";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The dashboard layout already redirects unauthenticated visitors, but
  // Next.js may render this page concurrently with that check, so guard
  // here too rather than risk a null-user crash.
  if (!user) {
    redirect("/login");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-600">Vaš prostor</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">Vaši događaji</h1>
          <p className="mt-1 text-ink-700">Upravljajte događajima i pogledajte fotografije gostiju.</p>
        </div>
        <CreateEventModal />
      </div>

      {!events || events.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink-900/20 bg-white/60 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-900">
            <SparkleIcon className="h-8 w-8 text-gold-400" aria-hidden />
          </div>
          <p className="mt-5 font-display text-xl text-ink-900">Još nemate kreiranih događaja</p>
          <p className="mx-auto mt-2 max-w-sm text-ink-700">
            Kliknite na &ldquo;+ Novi događaj&rdquo; da kreirate svoj prvi događaj i podijelite QR kod s
            gostima.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {events.map((event) => {
            const eventTypeInfo = EVENT_TYPES[event.event_type];
            const coverUrl = event.cover_image_path
              ? supabase.storage.from("photos").getPublicUrl(event.cover_image_path).data.publicUrl
              : null;

            return (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="card-surface-interactive group flex flex-col gap-4 overflow-hidden p-0"
              >
                {coverUrl && (
                  // Guest/owner-chosen cover image, dimensions unknown ahead of time.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt=""
                    aria-hidden
                    className="h-32 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-2xl tracking-tight text-ink-900">{event.title}</p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-ink-700 transition group-hover:-translate-y-0.5 group-hover:bg-ink-900 group-hover:text-gold-400">
                      <ChevronRightIcon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-ink-700">
                    <CalendarIcon className="h-4 w-4" aria-hidden />
                    {formatDateShort(event.event_date)}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-ink-900/10 pt-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-700">
                      <Icon name={eventTypeInfo.icon} className="h-3.5 w-3.5" aria-hidden /> {eventTypeInfo.label}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.gallery_public
                          ? "bg-green-100 text-green-800"
                          : "bg-ink-900/5 text-ink-700"
                      }`}
                    >
                      {event.gallery_public ? "Javna galerija" : "Privatna galerija"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
