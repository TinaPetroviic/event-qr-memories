import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";

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
    <main className="flex-1 bg-cream-50 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Link href={`/e/${slug}`} className="text-sm text-gold-600 hover:underline">
          ← Nazad
        </Link>
        <div className="mt-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">Galerija</p>
          <h1 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
            {event.bride_name} <span className="text-gold-500">&amp;</span> {event.groom_name}
          </h1>
          <p className="mt-2 text-ink-700">{photos.length} uspomena podijeljeno s ljubavlju</p>
        </div>

        <div className="mt-10">
          <PhotoGrid eventId={event.id} photos={photos} />
        </div>
      </div>
    </main>
  );
}
