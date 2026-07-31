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
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">Vaš prostor</p>
          <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-4xl">Vaša vjenčanja</h1>
          <p className="mt-1 text-ink-700">Upravljajte događajima i pogledajte fotografije gostiju.</p>
        </div>
        <CreateEventModal />
      </div>

      {!events || events.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-gold-400/40 bg-white/50 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 text-3xl">
            💍
          </div>
          <p className="mt-5 font-display text-xl text-ink-900">Još nemate kreiranih događaja</p>
          <p className="mx-auto mt-2 max-w-sm text-ink-700">
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
              className="card-surface-interactive group flex flex-col gap-4 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-2xl text-ink-900">
                  {event.bride_name} <span className="text-gold-500">&amp;</span> {event.groom_name}
                </p>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-lg text-gold-600 transition group-hover:-translate-y-0.5 group-hover:bg-gold-500 group-hover:text-white">
                  →
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-ink-700">
                <span aria-hidden>📅</span>
                {formatDateShort(event.wedding_date)}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-gold-400/15 pt-4">
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
