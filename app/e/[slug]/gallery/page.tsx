import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";
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
    <main className="relative flex-1 bg-cream-50 px-4 py-14 sm:py-20">
      <div className="relative mx-auto max-w-5xl">
        <Link
          href={`/e/${slug}`}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 transition hover:gap-2.5 hover:text-gold-700"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          Natrag
        </Link>
        <div className="mt-6 text-center">
          <p className="divider-flourish justify-center text-xs font-medium uppercase tracking-[0.2em] text-gold-600">
            <span>Galerija</span>
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm text-ink-700 shadow-sm shadow-ink-900/5">
            <HeartIcon className="h-4 w-4" aria-hidden />
            {photos.length} uspomena podijeljeno s ljubavlju
          </p>
        </div>

        <div className="mt-10">
          <PhotoGrid eventId={event.id} photos={photos} />
        </div>
      </div>
    </main>
  );
}
