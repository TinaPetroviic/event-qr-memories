import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateEventModal } from "@/components/CreateEventModal";
import { formatDateShort } from "@/lib/utils/date";

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
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">Vaša vjenčanja</h1>
          <p className="mt-1 text-ink-700">Upravljajte događajima i pogledajte fotografije gostiju.</p>
        </div>
        <CreateEventModal />
      </div>

      {!events || events.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-gold-400/40 bg-white/50 p-12 text-center">
          <p className="font-display text-xl text-ink-900">Još nemate kreiranih događaja</p>
          <p className="mt-2 text-ink-700">
            Kliknite na &ldquo;+ Novo vjenčanje&rdquo; da kreirate svoj prvi događaj i podijelite QR kod s
            gostima.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="group rounded-3xl border border-gold-400/30 bg-white/70 p-6 shadow-sm shadow-gold-600/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-600/10"
            >
              <p className="font-display text-2xl text-ink-900">
                {event.bride_name} <span className="text-gold-500">&amp;</span> {event.groom_name}
              </p>
              <p className="mt-1 text-sm text-ink-700">{formatDateShort(event.wedding_date)}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-700">
                  /e/{event.slug}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
