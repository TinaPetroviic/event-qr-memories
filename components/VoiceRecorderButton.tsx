"use client";

import { useEffect, useRef, useState } from "react";
import { HeadphonesIcon, MicrophoneIcon } from "@/components/icons";

type RecorderState = "idle" | "recording" | "preview" | "unsupported";

export function VoiceRecorderButton({
  onUpload,
  disabled,
}: {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined";

    // Capability check can only happen client-side after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(supported ? "idle" : "unsupported");

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setPreviewUrl(URL.createObjectURL(blob));
        setState("preview");
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      // Microphone permission denied or unavailable - stay idle rather than throwing.
      setState("idle");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  };

  const discardAndRerecord = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    chunksRef.current = [];
    setState("idle");
  };

  const send = async () => {
    if (!chunksRef.current.length) return;
    setUploading(true);
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "poruka.webm", { type: "audio/webm" });
      await onUpload(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      chunksRef.current = [];
      setState("idle");
    } finally {
      setUploading(false);
    }
  };

  if (state === "unsupported") return null;

  if (state === "preview") {
    return (
      <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl border border-gold-400/30 bg-cream-50 p-4 shadow-inner">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold-600">
          <HeadphonesIcon className="h-3.5 w-3.5" aria-hidden /> Preslušajte prije slanja
        </p>
        <audio controls src={previewUrl} className="w-full" />
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={discardAndRerecord}
            disabled={uploading}
            className="btn-outline flex-1 px-4 py-2 text-sm"
          >
            Snimi ponovo
          </button>
          <button type="button" onClick={send} disabled={uploading} className="btn-primary flex-1 px-4 py-2 text-sm">
            {uploading ? "Slanje..." : "Pošalji"}
          </button>
        </div>
      </div>
    );
  }

  if (state === "recording") {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return (
      <button
        type="button"
        onClick={stopRecording}
        className="mt-3 inline-flex items-center gap-3 rounded-full border border-red-400 bg-red-50 px-6 py-3 font-medium text-red-700 shadow-sm transition hover:bg-red-100"
      >
        <span className="flex items-end gap-0.5" aria-hidden>
          <span className="h-2 w-1 animate-pulse rounded-full bg-red-500" style={{ animationDelay: "0ms" }} />
          <span className="h-3.5 w-1 animate-pulse rounded-full bg-red-600" style={{ animationDelay: "150ms" }} />
          <span className="h-2.5 w-1 animate-pulse rounded-full bg-red-500" style={{ animationDelay: "300ms" }} />
        </span>
        Snimanje... {mm}:{ss} (dodirnite za zaustavljanje)
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="btn-outline px-6 py-3"
    >
      <MicrophoneIcon className="h-5 w-5" aria-hidden /> Snimi glasovnu poruku
    </button>
  );
}
