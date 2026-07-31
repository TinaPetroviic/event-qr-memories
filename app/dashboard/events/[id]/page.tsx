import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QRCodeCard } from "@/components/QRCodeCard";
import { EventSettingsForm } from "@/components/EventSettingsForm";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";
import { DownloadGalleryButton } from "@/components/DownloadGalleryButton";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { AdminPanelTabs } from "@/components/AdminPanelTabs";
import { formatDateShort } from "@/lib/utils/date";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { CalendarIcon, CameraIcon, Icon, MicrophoneIcon, VideoIcon } from "@/components/icons";

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
    mediaType: p.media_type,
    createdAt: p.created_at,
  }));

  // Real, honestly-computable counts only - no view/visit analytics exist in
  // this app, so we don't fabricate a "guests reached" style stat.
  const photoCount = photos.filter((p) => p.mediaType === "photo").length;
  const videoCount = photos.filter((p) => p.mediaType === "video").length;
  const audioCount = photos.filter((p) => p.mediaType === "audio").length;

  const coverUrl = event.cover_image_path
    ? supabase.storage.from("photos").getPublicUrl(event.cover_image_path).data.publicUrl
    : null;

  const eventTypeInfo = EVENT_TYPES[event.event_type];

  const summaryPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="card-surface overflow-hidden lg:col-span-2">
          {coverUrl && (
            // Owner-chosen cover image, dimensions unknown ahead of time.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" aria-hidden className="h-40 w-full object-cover sm:h-52" />
          )}
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-600">Detalji događaja</p>
            <h3 className="mt-2 font-display text-2xl tracking-tight text-ink-900">{event.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-ink-700">
                <CalendarIcon className="h-4 w-4" aria-hidden /> {formatDateShort(event.event_date)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-ink-700">
                <Icon name={eventTypeInfo.icon} className="h-4 w-4" aria-hidden /> {eventTypeInfo.label}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-medium ${
                  event.gallery_public ? "bg-green-100 text-green-800" : "bg-ink-900/5 text-ink-700"
                }`}
              >
                {event.gallery_public ? "Javna galerija" : "Privatna galerija"}
              </span>
            </div>
          </div>
        </div>

        <QRCodeCard
          slug={event.slug}
          title={event.title}
          eventDate={formatDateShort(event.event_date)}
          design={event.qr_design}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-surface p-5 text-center">
          <p className="font-display text-3xl tracking-tight text-ink-900">{photos.length}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-700/70">Ukupno uspomena</p>
        </div>
        <div className="card-surface p-5 text-center">
          <p className="font-display text-3xl tracking-tight text-ink-900">{photoCount}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-ink-700/70">
            <CameraIcon className="h-3.5 w-3.5" aria-hidden /> Fotografije
          </p>
        </div>
        <div className="card-surface p-5 text-center">
          <p className="font-display text-3xl tracking-tight text-ink-900">{videoCount}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-ink-700/70">
            <VideoIcon className="h-3.5 w-3.5" aria-hidden /> Videa
          </p>
        </div>
        <div className="card-surface p-5 text-center">
          <p className="font-display text-3xl tracking-tight text-ink-900">{audioCount}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-ink-700/70">
            <MicrophoneIcon className="h-3.5 w-3.5" aria-hidden /> Glasovne poruke
          </p>
        </div>
      </div>
    </div>
  );

  const settingsPanel = (
    <div className="card-surface p-6">
      <h3 className="mb-1 font-display text-xl tracking-tight text-ink-900">Postavke događaja</h3>
      <p className="mb-5 text-sm text-ink-700">
        Uredite osnovne podatke, poruku dobrodošlice i izgled QR kartice.
      </p>
      <EventSettingsForm event={event} />
    </div>
  );

  const galleryPanel = (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/10 pb-3">
        <h3 className="font-display text-xl tracking-tight text-ink-900">
          Uspomene gostiju <span className="text-ink-700">({photos.length})</span>
        </h3>
        {photos.length > 0 && <DownloadGalleryButton photos={photos} zipName={event.title} />}
      </div>
      <PhotoGrid eventId={event.id} photos={photos} editable />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-gold-600 hover:underline">
          ← Natrag na sve događaje
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-ink-900/10 pb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-600">Admin panel</p>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-ink-900 sm:text-4xl">{event.title}</h1>
            <p className="mt-1 text-ink-700">{formatDateShort(event.event_date)}</p>
          </div>
          <DeleteEventButton eventId={event.id} />
        </div>
      </div>

      <AdminPanelTabs summary={summaryPanel} settings={settingsPanel} gallery={galleryPanel} />
    </div>
  );
}
