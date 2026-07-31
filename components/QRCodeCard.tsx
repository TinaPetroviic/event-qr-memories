"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function QRCodeCard({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [guestUrl, setGuestUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/e/${slug}`;
    // Reading window.location is only possible client-side after mount, so
    // this state can't be derived during render (server has no window).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuestUrl(url);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 1,
        color: { dark: "#2e2419", light: "#fdfbf6" },
      }).catch(() => {});
    }
  }, [slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable - noop
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-kod-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="rounded-3xl border border-gold-400/30 bg-white/70 p-6 text-center shadow-sm shadow-gold-600/5">
      <h3 className="font-display text-xl text-ink-900">QR kod za goste</h3>
      <p className="mt-1 text-sm text-ink-700">Isprintajte ili podijelite kod kako bi gosti dodali fotografije.</p>

      <div className="mt-5 flex justify-center">
        <div className="rounded-2xl bg-cream-50 p-4 shadow-inner">
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-gold-400/30 bg-cream-50 px-3 py-2 text-left">
        <span className="flex-1 truncate text-sm text-ink-700">{guestUrl}</span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-full border border-gold-500/50 px-4 py-2 text-sm font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white"
        >
          {copied ? "Kopirano!" : "Kopiraj link"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600"
        >
          Preuzmi PNG
        </button>
      </div>
    </div>
  );
}
