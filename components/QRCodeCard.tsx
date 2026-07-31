"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QR_DESIGNS, type QrDesignKey } from "@/lib/qrDesigns";

/** Small L-shaped "viewfinder" corner marks rendered around the QR code. */
function CornerBrackets({ color }: { color: string }) {
  const arm = "h-6 w-6 sm:h-7 sm:w-7";
  return (
    <>
      <span className={`pointer-events-none absolute -left-2 -top-2 ${arm} border-l-2 border-t-2`} style={{ borderColor: color }} aria-hidden />
      <span className={`pointer-events-none absolute -right-2 -top-2 ${arm} border-r-2 border-t-2`} style={{ borderColor: color }} aria-hidden />
      <span className={`pointer-events-none absolute -bottom-2 -left-2 ${arm} border-b-2 border-l-2`} style={{ borderColor: color }} aria-hidden />
      <span className={`pointer-events-none absolute -bottom-2 -right-2 ${arm} border-b-2 border-r-2`} style={{ borderColor: color }} aria-hidden />
    </>
  );
}

/** Sets ctx.letterSpacing where supported (modern Chromium); no-op elsewhere. */
function setCanvasLetterSpacing(ctx: CanvasRenderingContext2D, px: number) {
  try {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
  } catch {
    // unsupported - falls back to default (tighter) spacing
  }
}

/** Draws 4 short two-segment "viewfinder" corner brackets around a box. */
function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  arm: number,
  color: string,
  lineWidth: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "square";
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(x, y + arm);
  ctx.lineTo(x, y);
  ctx.lineTo(x + arm, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w - arm, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + arm);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w, y + h - arm);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w - arm, y + h);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + arm, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h - arm);
  ctx.stroke();

  ctx.restore();
}

export function QRCodeCard({
  slug,
  title,
  eventDate,
  design,
}: {
  slug: string;
  title: string;
  eventDate: string;
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
        width: 200,
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
        width: 560,
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

      // Background fill.
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);

      // Editorial frame: generous margins + a thin hairline (or double
      // hairline for the more ornate themes) instead of one bold border.
      const outerInset = 64;
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.75;
      if (theme.key === "rustic") ctx.setLineDash([9, 7]);
      ctx.strokeRect(outerInset, outerInset, width - outerInset * 2, height - outerInset * 2);
      ctx.setLineDash([]);
      if (theme.frameStyle === "double") {
        const innerInset = outerInset + 18;
        ctx.lineWidth = 1.25;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(innerInset, innerInset, width - innerInset * 2, height - innerInset * 2);
        ctx.globalAlpha = 1;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // Eyebrow label - small, uppercase, letter-spaced.
      ctx.fillStyle = theme.accentColor;
      ctx.font = "600 22px system-ui, sans-serif";
      setCanvasLetterSpacing(ctx, 4);
      ctx.fillText(theme.eyebrow.toUpperCase(), width / 2, 190, width - 220);
      setCanvasLetterSpacing(ctx, 0);

      // Event title (a single free-form string - may or may not already
      // contain "&", e.g. "Nina & Marko" vs. "Rođendan Amele" - so it's
      // drawn as-is rather than assuming a "Name & Name" split).
      ctx.fillStyle = theme.textColor;
      if (theme.headlineStyle === "stacked") {
        ctx.font = "800 58px system-ui, sans-serif";
        setCanvasLetterSpacing(ctx, 3);
        ctx.fillText(title.toUpperCase(), width / 2, 275, width - 140);
        setCanvasLetterSpacing(ctx, 0);
      } else {
        ctx.font = `${theme.headlineItalic ? "italic " : ""}600 64px ${serifFamily}, serif`;
        ctx.fillText(title, width / 2, 280, width - 140);
      }

      // Thin decorative divider with the theme's motif centered on it.
      const dividerY = 345;
      ctx.strokeStyle = theme.accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 90, dividerY);
      ctx.lineTo(width / 2 - 24, dividerY);
      ctx.moveTo(width / 2 + 24, dividerY);
      ctx.lineTo(width / 2 + 90, dividerY);
      ctx.stroke();
      ctx.fillStyle = theme.accentColor;
      ctx.font = "26px serif";
      ctx.textBaseline = "middle";
      ctx.fillText(theme.motif, width / 2, dividerY + 1);
      ctx.textBaseline = "alphabetic";

      // Event date - smaller, letter-spaced.
      ctx.fillStyle = theme.accentColor;
      ctx.font = "500 30px system-ui, sans-serif";
      setCanvasLetterSpacing(ctx, 2);
      ctx.fillText(eventDate.toUpperCase(), width / 2, 400, width - 140);
      setCanvasLetterSpacing(ctx, 0);

      // QR code, with a light backing tile (for scan contrast) framed by
      // camera-viewfinder-style corner brackets.
      const qrSize = 560;
      const qrX = (width - qrSize) / 2;
      const qrY = 470;
      const backingPad = 22;
      ctx.fillStyle = theme.qr.light;
      ctx.fillRect(qrX - backingPad, qrY - backingPad, qrSize + backingPad * 2, qrSize + backingPad * 2);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      const bracketGap = 16;
      drawCornerBrackets(
        ctx,
        qrX - backingPad - bracketGap,
        qrY - backingPad - bracketGap,
        qrSize + (backingPad + bracketGap) * 2,
        qrSize + (backingPad + bracketGap) * 2,
        46,
        theme.accentColor,
        4,
      );

      // Caption.
      ctx.fillStyle = theme.textColor;
      ctx.globalAlpha = 0.75;
      ctx.font = "300 32px system-ui, sans-serif";
      ctx.fillText(theme.caption, width / 2, qrY + qrSize + backingPad + 70, width - 160);
      ctx.globalAlpha = 1;

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
      className="relative overflow-hidden rounded-3xl p-6 text-center shadow-md transition-colors duration-300 sm:p-8"
      style={{ background: theme.background }}
    >
      {/* Generous-margin editorial frame: a thin inset hairline, doubled for the more ornate themes. */}
      <div
        className="pointer-events-none absolute inset-3 rounded-2xl sm:inset-4"
        style={{
          border: `1px ${theme.key === "rustic" ? "dashed" : "solid"} ${theme.border}`,
        }}
        aria-hidden
      />
      {theme.frameStyle === "double" && (
        <div
          className="pointer-events-none absolute inset-4 rounded-xl opacity-60 sm:inset-5"
          style={{ border: `1px solid ${theme.border}` }}
          aria-hidden
        />
      )}

      <div className="relative">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.25em] sm:text-xs"
          style={{ color: theme.accentColor }}
        >
          {theme.eyebrow}
        </p>

        <h3
          className={
            theme.headlineStyle === "stacked"
              ? "mt-3 text-2xl font-extrabold uppercase tracking-widest sm:text-3xl"
              : `mt-3 font-display text-2xl sm:text-3xl ${theme.headlineItalic ? "italic" : ""}`
          }
          style={{ color: theme.textColor }}
        >
          {title}
        </h3>

        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-9" style={{ background: theme.border }} />
          <span className="text-sm leading-none" style={{ color: theme.accentColor }}>
            {theme.motif}
          </span>
          <span className="h-px w-9" style={{ background: theme.border }} />
        </div>

        <p
          className="mt-3 text-[11px] uppercase tracking-[0.2em]"
          style={{ color: theme.accentColor, opacity: 0.9 }}
        >
          {eventDate}
        </p>

        <div className="mt-6 flex justify-center">
          <div className="relative inline-block p-2.5">
            <CornerBrackets color={theme.accentColor} />
            <div className="rounded-xl p-4 shadow-inner" style={{ background: theme.qr.light }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-[220px] text-xs font-light" style={{ color: theme.textColor, opacity: 0.7 }}>
          {theme.caption}
        </p>

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
    </div>
  );
}
