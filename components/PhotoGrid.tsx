"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { deletePhoto } from "@/app/dashboard/events/[id]/actions";
import { formatTimestampShort } from "@/lib/utils/date";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, HeartIcon, MicrophoneIcon, VideoIcon } from "@/components/icons";

type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

export type GalleryPhoto = {
  id: string;
  url: string;
  storagePath: string;
  guestName: string | null;
  mediaType: "photo" | "video" | "audio";
  createdAt: string;
};

export function PhotoGrid({
  eventId,
  photos,
  editable = false,
}: {
  eventId: string;
  photos: GalleryPhoto[];
  editable?: boolean;
}) {
  const [items, setItems] = useState(photos);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    if (lightboxIndex === null) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((idx) => {
          if (idx === null) return idx;
          return idx + 1 < items.length ? idx + 1 : idx;
        });
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((idx) => {
          if (idx === null) return idx;
          return idx > 0 ? idx - 1 : idx;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, items.length]);

  // Live-update the grid when a guest adds media or the couple deletes it
  // from another tab/device, so nobody needs to refresh the page to see it.
  // RLS still applies to these events (a connection only receives change
  // events for rows it could otherwise select), so this changes nothing
  // about who can see what - only how fast they see it.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`photos-changes-${eventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos", filter: `event_id=eq.${eventId}` },
        (payload) => {
          const row = payload.new as PhotoRow;
          setItems((prev) => {
            if (prev.some((p) => p.id === row.id)) return prev;
            const photo: GalleryPhoto = {
              id: row.id,
              url: supabase.storage.from("photos").getPublicUrl(row.storage_path).data.publicUrl,
              storagePath: row.storage_path,
              guestName: row.guest_name,
              mediaType: row.media_type,
              createdAt: row.created_at,
            };
            return [photo, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photos", filter: `event_id=eq.${eventId}` },
        (payload) => {
          const deletedId = (payload.old as Partial<PhotoRow>).id;
          if (!deletedId) return;
          setItems((prev) => {
            const next = prev.filter((p) => p.id !== deletedId);
            if (next.length === prev.length) return prev;
            setLightboxIndex((idx) => {
              if (idx === null) return idx;
              if (next.length === 0) return null;
              return idx >= next.length ? next.length - 1 : idx;
            });
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/20 bg-white/60 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900">
          <HeartIcon className="h-6 w-6 text-gold-400" aria-hidden />
        </div>
        <p className="mt-4 font-display text-lg tracking-tight text-ink-900">Još nema uspomena</p>
        <p className="mx-auto mt-2 max-w-sm text-ink-700">
          Budite prvi koji će podijeliti trenutak – fotografije, videa i glasovne poruke gostiju pojavit će se
          ovdje čim ih pošalju.
        </p>
      </div>
    );
  }

  const handleDelete = (photo: GalleryPhoto) => {
    setPendingId(photo.id);
    startTransition(async () => {
      await deletePhoto(eventId, photo.id, photo.storagePath);
      setItems((prev) => {
        const next = prev.filter((p) => p.id !== photo.id);
        setLightboxIndex((idx) => {
          if (idx === null) return idx;
          if (next.length === 0) return null;
          return idx >= next.length ? next.length - 1 : idx;
        });
        return next;
      });
      setPendingId(null);
    });
  };

  const activePhoto = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((photo, index) => (
          <div
            key={photo.id}
            role="button"
            tabIndex={0}
            onClick={() => setLightboxIndex(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxIndex(index);
              }
            }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-ink-900/10 bg-cream-100 shadow-sm transition hover:shadow-lg hover:shadow-ink-900/10"
          >
            {photo.mediaType === "photo" && (
              // Guest-uploaded content, dimensions unknown ahead of time.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.url}
                alt={photo.guestName ? `Fotografija od ${photo.guestName}` : "Fotografija s događaja"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                loading="lazy"
              />
            )}
            {photo.mediaType === "video" && (
              <div className="relative h-full w-full">
                <video controls playsInline className="h-full w-full object-cover">
                  <source src={photo.url} />
                </video>
                <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink-900/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  <VideoIcon className="h-2.5 w-2.5" aria-hidden /> Video
                </span>
              </div>
            )}
            {photo.mediaType === "audio" && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ink-900 p-4 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <MicrophoneIcon className="h-5 w-5 text-gold-400" aria-hidden />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-gold-300">Glasovna poruka</p>
                <audio controls className="w-full" src={photo.url} onClick={(e) => e.stopPropagation()} />
              </div>
            )}
            {photo.guestName && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-2">
                <p className="truncate text-xs font-medium text-white">{photo.guestName}</p>
              </div>
            )}
            {editable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo);
                }}
                disabled={isPending && pendingId === photo.id}
                className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600 disabled:opacity-100"
              >
                {isPending && pendingId === photo.id ? "..." : "Izbriši"}
              </button>
            )}
          </div>
        ))}
      </div>

      {activePhoto &&
        lightboxIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4"
            onClick={closeLightbox}
          >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Zatvori"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <CloseIcon className="h-5 w-5" aria-hidden />
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              aria-label="Prethodno"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden />
            </button>
          )}
          {lightboxIndex < items.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              aria-label="Sljedeće"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden />
            </button>
          )}

          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activePhoto.mediaType === "photo" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activePhoto.url}
                alt={activePhoto.guestName ? `Fotografija od ${activePhoto.guestName}` : "Fotografija s događaja"}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
              />
            )}
            {activePhoto.mediaType === "video" && (
              <video controls playsInline autoPlay={false} className="max-h-[70vh] w-auto max-w-full rounded-2xl">
                <source src={activePhoto.url} />
              </video>
            )}
            {activePhoto.mediaType === "audio" && (
              <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100">
                  <MicrophoneIcon className="h-5 w-5 text-gold-600" aria-hidden />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-gold-600">Glasovna poruka</p>
                <audio controls className="w-full" src={activePhoto.url} />
              </div>
            )}

            <div className="text-center text-white">
              {activePhoto.guestName && <p className="font-medium">{activePhoto.guestName}</p>}
              <p className="text-sm text-white/70">{formatTimestampShort(activePhoto.createdAt)}</p>
            </div>

            {editable && (
              <button
                type="button"
                onClick={() => handleDelete(activePhoto)}
                disabled={isPending && pendingId === activePhoto.id}
                className="rounded-full bg-red-600/90 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {isPending && pendingId === activePhoto.id ? "Brisanje..." : "Izbriši"}
              </button>
            )}
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
