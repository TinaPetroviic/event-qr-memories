import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QrShareCard } from "@/components/QrShareCard";
import { EventSettingsForm } from "@/components/EventSettingsForm";
import { PhotoGrid, type GalleryPhoto } from "@/components/PhotoGrid";
import { DownloadGalleryButton } from "@/components/DownloadGalleryButton";
import { AdminPanelTabs } from "@/components/AdminPanelTabs";
import { formatDateShort } from "@/lib/utils/date";
import { EVENT_TYPES } from "@/lib/eventTypes";
import {
  CalendarIcon,
  CameraIcon,
  Icon,
  LinkIcon,
  MicrophoneIcon,
  VideoIcon,
} from "@/components/icons";

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
  const guestPath = `/e/${event.slug}`;

  const summaryPanel = (
    <div className="space-y-6">
      {/* items-start (rather than the CSS Grid default of "stretch") lets each
          card size to its own content, so the shorter details card never
          gets pulled down to match the taller QR card's height. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="card-surface overflow-hidden lg:col-span-2">
          {coverUrl ? (
            // Owner-chosen cover image, dimensions unknown ahead of time.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" aria-hidden className="h-40 w-full object-cover sm:h-48" />
          ) : (
            // No cover uploaded - a soft themed placeholder (built from the
            // event's own type, not fabricated data) so the card still reads
            // as a considered hero rather than an empty gap.
            <div
              aria-hidden
              className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-gold-200/70 via-cream-100 to-blush-100 sm:h-48"
            >
              <Icon name={eventTypeInfo.icon} className="h-12 w-12 text-gold-500/70" aria-hidden />
            </div>
          )}
          <div className="p-6 sm:p-7">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">Detalji događaja</p>
            <h3 className="mt-2 font-display text-2xl text-ink-900 sm:text-3xl">{event.title}</h3>
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

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gold-400/25 to-transparent" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">Stranica za goste</p>
            <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-gold-400/25 bg-cream-50 px-4 py-3">
              <LinkIcon className="h-4 w-4 shrink-0 text-gold-500" aria-hidden />
              <span className="flex-1 truncate text-sm text-ink-700">{guestPath}</span>
              <Link
                href={guestPath}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-medium text-gold-600 hover:underline"
              >
                Otvori
              </Link>
            </div>
          </div>
        </div>

        <QrShareCard
          eventId={event.id}
          slug={event.slug}
          title={event.title}
          eventDate={formatDateShort(event.event_date)}
          initialDesign={event.qr_design}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          className="card-surface animate-scale-in flex flex-col items-center gap-1 bg-gradient-to-br from-gold-400 to-gold-600 p-5 text-center text-white shadow-md shadow-gold-600/25"
          style={{ animationDelay: "0ms" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Icon name="sparkle" className="h-4 w-4" aria-hidden />
          </span>
          <p className="mt-1 font-display text-3xl">{photos.length}</p>
          <p className="text-xs uppercase tracking-wide text-white/85">Ukupno uspomena</p>
        </div>
        <div className="card-surface animate-scale-in flex flex-col items-center gap-1 p-5 text-center" style={{ animationDelay: "70ms" }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-600">
            <CameraIcon className="h-4 w-4" aria-hidden />
          </span>
          <p className="mt-1 font-display text-3xl text-ink-900">{photoCount}</p>
          <p className="text-xs uppercase tracking-wide text-ink-700/70">Fotografije</p>
        </div>
        <div className="card-surface animate-scale-in flex flex-col items-center gap-1 p-5 text-center" style={{ animationDelay: "140ms" }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-blush-600">
            <VideoIcon className="h-4 w-4" aria-hidden />
          </span>
          <p className="mt-1 font-display text-3xl text-ink-900">{videoCount}</p>
          <p className="text-xs uppercase tracking-wide text-ink-700/70">Videa</p>
        </div>
        <div className="card-surface animate-scale-in flex flex-col items-center gap-1 p-5 text-center" style={{ animationDelay: "210ms" }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-200 text-ink-700">
            <MicrophoneIcon className="h-4 w-4" aria-hidden />
          </span>
          <p className="mt-1 font-display text-3xl text-ink-900">{audioCount}</p>
          <p className="text-xs uppercase tracking-wide text-ink-700/70">Glasovne poruke</p>
        </div>
      </div>
    </div>
  );

  const settingsPanel = (
    <div className="card-surface p-6">
      <h3 className="mb-1 font-display text-xl text-ink-900">Postavke događaja</h3>
      <p className="mb-5 text-sm text-ink-700">
        Uredite osnovne podatke i poruku dobrodošlice za goste. Dizajn QR kartice mijenjate izravno na kartici u
        Pregledu.
      </p>
      <EventSettingsForm event={event} />
    </div>
  );

  const galleryPanel = (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold-400/15 pb-3">
        <h3 className="font-display text-xl text-ink-900">
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
        <div className="mt-2 border-b border-gold-400/15 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">Admin panel</p>
          <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-4xl">{event.title}</h1>
          <p className="mt-1 text-ink-700">{formatDateShort(event.event_date)}</p>
        </div>
      </div>

      <AdminPanelTabs summary={summaryPanel} settings={settingsPanel} gallery={galleryPanel} />
    </div>
  );
}
