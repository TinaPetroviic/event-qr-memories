"use client";

import { useState } from "react";
import JSZip from "jszip";
import { slugify } from "@/lib/utils/slug";
import type { GalleryPhoto } from "@/components/PhotoGrid";

function extensionFromPath(storagePath: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(storagePath);
  return match ? match[1].toLowerCase() : "bin";
}

export function DownloadGalleryButton({ photos, zipName }: { photos: GalleryPhoto[]; zipName: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  if (photos.length === 0) {
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    setMessage(null);
    setProgress(0);

    const zip = new JSZip();
    let skipped = 0;

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      try {
        const response = await fetch(photo.url);
        if (!response.ok) throw new Error("fetch failed");
        const blob = await response.blob();
        const namePart = photo.guestName ? slugify(photo.guestName) : "gost";
        const extension = extensionFromPath(photo.storagePath);
        zip.file(`${i + 1}-${namePart || "gost"}.${extension}`, blob);
      } catch {
        skipped += 1;
      }
      setProgress(i + 1);
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(zipName) || "galerija"}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage(
        skipped > 0
          ? `Preuzimanje spremno. Preskočeno je ${skipped} od ${photos.length} datoteka (nije bilo moguće preuzeti).`
          : "Preuzimanje je spremno."
      );
    } catch {
      setMessage("Došlo je do greške prilikom pripreme preuzimanja. Pokušajte ponovo.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <button type="button" onClick={handleDownload} disabled={isDownloading} className="btn-outline">
        {isDownloading ? `Priprema preuzimanja... ${progress}/${photos.length}` : "⬇ Preuzmi cijelu galeriju"}
      </button>
      {message && <p className="text-xs text-ink-700">{message}</p>}
    </div>
  );
}
