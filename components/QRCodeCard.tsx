"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QR_DESIGNS, type QrDesignKey } from "@/lib/qrDesigns";

export function QRCodeCard({
  slug,
  brideName,
  groomName,
  weddingDate,
  design,
}: {
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  design: QrDesignKey;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [guestUrl, setGuestUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const theme = QR_DESIGNS[design] ?? QR_DESIGNS.classic;

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
        color: { dark: theme.qr.dark, light: theme.qr.light },
      }).catch(() => {});
    }
  }, [slug, theme]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable - noop
    }
  };

  const handleDownload = async () => {
    const url = guestUrl || `${window.location.origin}/e/${slug}`;
    setDownloading(true);

    try {
      // 1. Render the QR code at high resolution onto an offscreen canvas,
      // using the design's dark/light colors for good print contrast.
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, url, {
        width: 620,
        margin: 1,
        color: { dark: theme.qr.dark, light: theme.qr.light },
      });

      // 2. Compose the printable portrait card.
      const width = 1000;
      const height = 1400;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = width;
      exportCanvas.height = height;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      // Make sure the site's serif font is loaded before we measure/draw text.
      try {
        await document.fonts?.ready;
      } catch {
        // ignore - falls back to a generic serif below
      }
      const serifFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-playfair").trim() || "serif";

      // Background + decorative frame.
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 6;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      ctx.textAlign = "center";

      // Motif.
      ctx.fillStyle = theme.accentColor;
      ctx.font = "72px serif";
      ctx.fillText(theme.motif, width / 2, 170);

      // Couple names.
      ctx.fillStyle = theme.textColor;
      ctx.font = `600 66px ${serifFamily}, serif`;
      ctx.fillText(`${brideName} & ${groomName}`, width / 2, 280, width - 140);

      // Wedding date.
      ctx.fillStyle = theme.accentColor;
      ctx.font = "32px sans-serif";
      ctx.fillText(weddingDate, width / 2, 335);

      // QR code, with a light backing tile so it stays scannable on any background.
      const qrSize = 620;
      const qrX = (width - qrSize) / 2;
      const qrY = 420;
      ctx.fillStyle = theme.qr.light;
      ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Caption.
      ctx.fillStyle = theme.textColor;
      ctx.font = "36px sans-serif";
      ctx.fillText("Skenirajte i podijelite fotografije", width / 2, qrY + qrSize + 90);

      const link = document.createElement("a");
      link.download = `qr-kartica-${slug}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="rounded-3xl border p-6 text-center shadow-md transition-colors duration-300"
      style={{ background: theme.background, borderColor: theme.border }}
    >
      <span
        className="mx-auto flex h-9 w-9 items-center justify-center rounded-full text-base"
        style={{ background: theme.accentColor, color: theme.background }}
      >
        {theme.motif}
      </span>
      <h3 className="mt-3 font-display text-xl" style={{ color: theme.textColor }}>
        QR kod za goste
      </h3>
      <p className="mt-1 text-sm" style={{ color: theme.textColor, opacity: 0.75 }}>
        Isprintajte ili podijelite kod kako bi gosti dodali fotografije.
      </p>

      <div className="mt-5 flex justify-center">
        <div className="rounded-2xl p-4 shadow-inner" style={{ background: theme.qr.light }}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div
        className="mt-5 flex items-center gap-2 rounded-xl border px-3 py-2 text-left"
        style={{ borderColor: theme.border, background: theme.qr.light }}
      >
        <span className="flex-1 truncate text-sm" style={{ color: theme.textColor, opacity: 0.85 }}>
          {guestUrl}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: theme.accentColor, color: theme.accentColor }}
        >
          {copied ? "Kopirano!" : "Kopiraj link"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
          style={{ background: theme.accentColor }}
        >
          {downloading ? "Priprema..." : "Preuzmi PNG"}
        </button>
      </div>
    </div>
  );
}
