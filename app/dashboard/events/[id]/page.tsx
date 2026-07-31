import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QRCodeCard } from "@/components/QRCodeCard";
import { EventSettingsForm } from "@/components/EventSettingsForm";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { formatWeddingDate } from "@/lib/utils/date";

export default async function EventAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event || event.owner_id !== user.id) {
    notFound();
  }

  const { data: photoRows } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  const photos: GalleryPhoto[] = (photoRows ?? []).map((p) => ({
    id: p.id,
    url: supabase.storage.from("photos").getPublicUrl(p.storage_path).data.publicUrl,
    storagePath: p.storage_path,
    guestName: p.guest_name,
    createdAt: p.created_at,
  }));

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-gold-600 hover:underline">
          ← Nazad na sva vjenčanja
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
              {event.bride_name} <span className="text-gold-500">&amp;</span> {event.groom_name}
            </h1>
            <p className="mt-1 text-ink-700">{formatWeddingDate(event.wedding_date)}</p>
          </div>
          <DeleteEventButton eventId={event.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QRCodeCard slug={event.slug} />
        </div>
        <div className="rounded-3xl border border-gold-400/30 bg-white/70 p-6 shadow-sm shadow-gold-600/5 lg:col-span-2">
          <h3 className="mb-4 font-display text-xl text-ink-900">Postavke događaja</h3>
          <EventSettingsForm event={event} />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-ink-900">
            Fotografije gostiju <span className="text-ink-700">({photos.length})</span>
          </h3>
        </div>
        <PhotoGrid eventId={event.id} photos={photos} editable />
      </div>
    </div>
  );
}
