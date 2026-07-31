import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { ChevronLeftIcon, HeartIcon } from "@/components/icons";

export default async function GuestGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).single();

  if (!event || !event.gallery_public) {
    notFound();
  }

  const { data: photoRows } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  const photos: GalleryPhoto[] = (photoRows ?? []).map((p) => ({
    id: p.id,
    url: supabase.storage.from("photos").getPublicUrl(p.storage_path).data.publicUrl,
    storagePath: p.storage_path,
    guestName: p.guest_name,
    mediaType: p.media_type,
    createdAt: p.created_at,
  }));

  return (
    <main className="relative flex-1 overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-14 sm:py-20">
      <DecorativeGlow />
      <div className="relative mx-auto max-w-5xl">
        <Link
          href={`/e/${slug}`}
          className="animate-fade-up group inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 transition hover:gap-2.5 hover:text-gold-700"
          style={{ animationDelay: "0ms" }}
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          Natrag
        </Link>
        <div className="mt-6 text-center">
          <p
            className="divider-flourish animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600"
            style={{ animationDelay: "80ms" }}
          >
            <span>Galerija</span>
          </p>
          <h1
            className="animate-fade-up mt-3 font-display text-3xl text-ink-900 sm:text-4xl"
            style={{ animationDelay: "150ms" }}
          >
            {event.title}
          </h1>
          <p
            className="animate-fade-up mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-1.5 text-sm text-ink-700 shadow-sm shadow-gold-600/5"
            style={{ animationDelay: "220ms" }}
          >
            <HeartIcon className="h-4 w-4" aria-hidden />
            {photos.length} uspomena podijeljeno s ljubavlju
          </p>
        </div>

        <div className="animate-fade-up mt-10" style={{ animationDelay: "290ms" }}>
          <PhotoGrid eventId={event.id} photos={photos} />
        </div>
      </div>
    </main>
  );
}
