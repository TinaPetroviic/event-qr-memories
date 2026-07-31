import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { formatDateShort } from "@/lib/utils/date";

export default async function GuestEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).single();

  if (!event) {
    notFound();
  }

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-14 sm:py-20">
      <DecorativeGlow />
      <div className="relative w-full max-w-xl text-center">
        <p
          className="divider-flourish animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600"
          style={{ animationDelay: "0ms" }}
        >
          <span>Dobrodošli na</span>
        </p>
        <h1
          className="animate-fade-up mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-6xl"
          style={{ animationDelay: "70ms" }}
        >
          QR Uspomene
        </h1>

        <p
          className="animate-fade-up mt-6 font-display text-2xl text-ink-900 sm:text-3xl"
          style={{ animationDelay: "140ms" }}
        >
          {event.title}
        </p>
        <p className="animate-fade-up mt-2 text-ink-700" style={{ animationDelay: "140ms" }}>
          {formatDateShort(event.event_date)}
        </p>

        {event.welcome_message && (
          <p
            className="animate-fade-up mx-auto mt-6 max-w-md text-balance rounded-2xl border border-gold-400/20 bg-white/50 px-5 py-4 font-display text-lg italic text-ink-700"
            style={{ animationDelay: "200ms" }}
          >
            &ldquo;{event.welcome_message}&rdquo;
          </p>
        )}

        <div className="animate-fade-up mt-10" style={{ animationDelay: "260ms" }}>
          <PhotoUploadForm eventId={event.id} />
        </div>

        {event.gallery_public && (
          <div className="animate-fade-up mt-8" style={{ animationDelay: "320ms" }}>
            <Link href={`/e/${event.slug}/gallery`} className="btn-outline px-6 py-2.5 text-sm">
              Pogledajte galeriju fotografija →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
