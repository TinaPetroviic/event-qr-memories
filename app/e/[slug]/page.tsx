import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { formatDateShort } from "@/lib/utils/date";
import { ChevronRightIcon, HeartIcon } from "@/components/icons";

export default async function GuestEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).single();

  if (!event) {
    notFound();
  }

  const coverUrl = event.cover_image_path
    ? supabase.storage.from("photos").getPublicUrl(event.cover_image_path).data.publicUrl
    : null;

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50">
      <DecorativeGlow />

      <div className="relative w-full max-w-xl px-4 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
        {/*
          Owner-chosen cover image, arbitrary aspect ratio/framing (tight face
          closeups, wide landscape venue shots, portrait crops - guests upload
          all sorts). A full-bleed object-cover banner fights every one of
          those differently, so instead this renders as a small, contained
          frame that reads as an intentional portrait no matter the source
          crop. A true circle was tried first and rejected: a circular mask's
          width falls off to zero right at the top/bottom of the crop window,
          which is exactly where a portrait full-length photo's faces tend to
          sit - it made couples' heads disappear. A softly rounded square
          (matching the card-surface radius used below) keeps almost the
          full square crop visible, degrading gracefully across closeups,
          landscapes and portraits alike. A slight upward object-position
          bias adds extra headroom for the full-length-portrait case without
          hurting the tightly-framed closeup case. The no-cover state gets a
          matching frame with a monogram so the hero never feels like it's
          missing something.
        */}
        <div
          className="animate-fade-up relative mx-auto mb-7 h-28 w-28 sm:h-32 sm:w-32"
          style={{ animationDelay: "0ms" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-[1.35] rounded-[2rem] bg-gradient-to-br from-gold-300/40 via-blush-300/25 to-transparent blur-2xl"
          />
          {coverUrl ? (
            <div className="h-full w-full overflow-hidden rounded-[1.75rem] border-[3px] border-white shadow-lg shadow-gold-600/25 ring-1 ring-gold-400/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="" aria-hidden className="h-full w-full object-cover object-[50%_30%]" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] border-[3px] border-white bg-gradient-to-br from-gold-200/70 via-cream-100 to-blush-100 shadow-lg shadow-gold-600/15 ring-1 ring-gold-400/25">
              <HeartIcon className="h-9 w-9 text-gold-500" aria-hidden />
            </div>
          )}
        </div>

        <p
          className="divider-flourish animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600"
          style={{ animationDelay: "90ms" }}
        >
          <span>Dobrodošli na</span>
        </p>
        <h1
          className="animate-fade-up mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-6xl"
          style={{ animationDelay: "170ms" }}
        >
          EventPix
        </h1>

        <p
          className="animate-fade-up mt-7 font-display text-2xl text-ink-900 sm:text-3xl"
          style={{ animationDelay: "250ms" }}
        >
          {event.title}
        </p>
        <p
          className="animate-fade-up mt-2 text-sm tracking-wide text-ink-500"
          style={{ animationDelay: "250ms" }}
        >
          {formatDateShort(event.event_date)}
        </p>

        {event.welcome_message && (
          <div className="animate-fade-up relative mx-auto mt-7 max-w-md" style={{ animationDelay: "330ms" }}>
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 left-2 select-none font-display text-6xl leading-none text-gold-300/60"
            >
              &ldquo;
            </span>
            <p className="text-balance rounded-2xl border border-gold-400/20 bg-white/55 px-6 py-5 font-display text-lg italic text-ink-700 shadow-sm shadow-gold-600/5">
              {event.welcome_message}
            </p>
          </div>
        )}

        <div className="animate-fade-up mt-10" style={{ animationDelay: "410ms" }}>
          <PhotoUploadForm eventId={event.id} />
        </div>

        {event.gallery_public && (
          <div className="animate-fade-up mt-8" style={{ animationDelay: "480ms" }}>
            <Link href={`/e/${event.slug}/gallery`} className="btn-outline group px-6 py-2.5 text-sm">
              Pogledajte galeriju fotografija
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
