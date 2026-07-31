"use client";

import { useEffect, useRef, useState } from "react";

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
      <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl border border-gold-400/30 bg-cream-50 p-4">
        <audio controls src={previewUrl} className="w-full" />
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={discardAndRerecord}
            disabled={uploading}
            className="flex-1 rounded-full border border-gold-500/50 px-4 py-2 text-sm font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white disabled:opacity-60"
          >
            Snimi ponovo
          </button>
          <button
            type="button"
            onClick={send}
            disabled={uploading}
            className="flex-1 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600 disabled:opacity-60"
          >
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
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-400 bg-red-50 px-6 py-3 font-medium text-red-700 shadow-sm transition hover:bg-red-100"
      >
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
        Snimanje... {mm}:{ss} (dodirnite za zaustavljanje)
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-6 py-3 font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white disabled:pointer-events-none disabled:opacity-60"
    >
      🎙️ Snimi glasovnu poruku
    </button>
  );
}
