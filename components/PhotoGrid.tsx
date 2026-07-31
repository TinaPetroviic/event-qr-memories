"use client";

import { useState, useTransition } from "react";
import { deletePhoto } from "@/app/dashboard/events/[id]/actions";

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

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gold-400/40 bg-white/50 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-2xl">
          🤍
        </div>
        <p className="mt-4 text-ink-700">Još nema uspomena. Prve fotografije i poruke gostiju pojaviće se ovdje.</p>
      </div>
    );
  }

  const handleDelete = (photo: GalleryPhoto) => {
    setPendingId(photo.id);
    startTransition(async () => {
      await deletePhoto(eventId, photo.id, photo.storagePath);
      setItems((prev) => prev.filter((p) => p.id !== photo.id));
      setPendingId(null);
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-gold-400/20 bg-cream-100 shadow-sm transition hover:shadow-lg hover:shadow-gold-600/10"
        >
          {photo.mediaType === "photo" && (
            // Guest-uploaded content, dimensions unknown ahead of time.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.url}
              alt={photo.guestName ? `Fotografija od ${photo.guestName}` : "Fotografija s vjenčanja"}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
          )}
          {photo.mediaType === "video" && (
            <div className="relative h-full w-full">
              <video controls playsInline className="h-full w-full object-cover">
                <source src={photo.url} />
              </video>
              <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-ink-900/60 px-2 py-0.5 text-[10px] font-medium text-white">
                🎥 Video
              </span>
            </div>
          )}
          {photo.mediaType === "audio" && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-gold-200/60 via-cream-100 to-blush-100 p-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-xl">
                🎙️
              </span>
              <p className="text-xs font-medium uppercase tracking-wide text-gold-600">Glasovna poruka</p>
              <audio controls className="w-full" src={photo.url} />
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
              onClick={() => handleDelete(photo)}
              disabled={isPending && pendingId === photo.id}
              className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600 disabled:opacity-100"
            >
              {isPending && pendingId === photo.id ? "..." : "Obriši"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
