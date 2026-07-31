"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { VoiceRecorderButton } from "@/components/VoiceRecorderButton";

type Status = "idle" | "uploading" | "success" | "error";
type MediaType = "photo" | "video" | "audio";

function mediaTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "photo";
}

export function PhotoUploadForm({ eventId }: { eventId: string }) {
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadOne = async (file: File, mediaType: MediaType) => {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || (mediaType === "audio" ? "webm" : "jpg");
    const path = `${eventId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("photos").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

    if (uploadError) {
      throw uploadError;
    }

    const { error: insertError } = await supabase.from("photos").insert({
      event_id: eventId,
      storage_path: path,
      guest_name: guestName.trim() || null,
      media_type: mediaType,
    });

    if (insertError) {
      throw insertError;
    }

    setUploadedCount((count) => count + 1);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setStatus("uploading");
    setErrorMessage("");

    try {
      for (const file of Array.from(files)) {
        await uploadOne(file, mediaTypeFromMime(file.type));
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Slanje nije uspjelo. Provjerite internetsku vezu i pokušajte ponovo.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleVoiceUpload = async (file: File) => {
    setStatus("uploading");
    setErrorMessage("");
    try {
      await uploadOne(file, "audio");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Slanje glasovne poruke nije uspjelo. Provjerite internetsku vezu i pokušajte ponovo.");
    }
  };

  return (
    <div className="card-surface bg-white/80 p-6 text-center shadow-md shadow-gold-600/10 sm:p-8">
      <div className="mx-auto mb-5 max-w-xs">
        <label htmlFor="guestName" className="mb-1 block text-sm font-medium text-ink-700">
          Vaše ime (opcionalno)
        </label>
        <input
          id="guestName"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="npr. Amela"
          className="input-field text-center"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        multiple
        className="hidden"
        id="photo-input"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={status === "uploading"}
      />
      <label
        htmlFor="photo-input"
        className={`btn-primary w-full cursor-pointer px-8 py-4 font-display text-lg sm:w-auto ${
          status === "uploading" ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {status === "uploading" ? "Slanje u tijeku..." : "📷 Dodaj fotografiju ili video"}
      </label>

      <div className="mt-1">
        <p className="my-4 text-xs uppercase tracking-[0.2em] text-ink-500">ili</p>
        <VoiceRecorderButton onUpload={handleVoiceUpload} disabled={status === "uploading"} />
      </div>

      {status === "success" && (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
          <span aria-hidden>✓</span> Hvala! Poslano uspomena: {uploadedCount}. Slobodno dodajte još.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{errorMessage}</p>
      )}
    </div>
  );
}
