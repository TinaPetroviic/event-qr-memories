import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { formatWeddingDate } from "@/lib/utils/date";

export default async function GuestEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).single();

  if (!event) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-14 sm:py-20">
      <div className="w-full max-w-xl text-center">
        <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
          <span>Dobrodošli na</span>
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-6xl">
          Capture the Love
        </h1>

        <p className="mt-6 font-display text-2xl text-ink-900 sm:text-3xl">
          {event.bride_name} <span className="text-gold-500">&amp;</span> {event.groom_name}
        </p>
        <p className="mt-2 text-ink-700">{formatWeddingDate(event.wedding_date)}</p>

        {event.welcome_message && (
          <p className="mx-auto mt-6 max-w-md text-balance text-ink-700">{event.welcome_message}</p>
        )}

        <div className="mt-10">
          <PhotoUploadForm eventId={event.id} />
        </div>

        {event.gallery_public && (
          <div className="mt-8">
            <Link
              href={`/e/${event.slug}/gallery`}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-6 py-2.5 text-sm font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white"
            >
              Pogledajte galeriju fotografija →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
