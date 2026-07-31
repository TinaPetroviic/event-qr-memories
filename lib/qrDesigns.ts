// Shared QR-card design definitions used by both the settings picker
// (components/EventSettingsForm.tsx) and the card renderer
// (components/QRCodeCard.tsx), so the two stay in sync.
//
// "classic" reproduces the app's original cream/gold look so existing events
// don't visually change unless the couple explicitly picks another design.

import type { QrMotifKey } from "@/lib/qrMotifs";

export type QrDesignKey = "classic" | "modern" | "romantic" | "rustic";

export type QrDesign = {
  key: QrDesignKey;
  label: string;
  /** CSS background (solid color or gradient) for the on-screen preview + printable card. */
  background: string;
  /** Card border/frame color used on screen. */
  border: string;
  /** Primary text color (names, caption). */
  textColor: string;
  /** Secondary/accent color (date, buttons, ornament, corner brackets). */
  accentColor: string;
  /** Colors handed to the `qrcode` library - needs enough contrast to scan reliably. */
  qr: { dark: string; light: string };
  /**
   * Small decorative ornament rendered on the card, as real vector line-art
   * (see lib/qrMotifs.ts + components/QrMotifIcon.tsx) rather than an emoji -
   * emoji rendering depends on the OS/browser's color emoji font and is a
   * robustness risk for the printable canvas PNG export.
   */
  motifKey: QrMotifKey;
  /** Short uppercase eyebrow label shown above the title, e.g. "SKENIRAJTE I PODIJELITE". */
  eyebrow: string;
  /** Caption line rendered below the QR code. */
  caption: string;
  /** Whether the title/headline is rendered in italic (softer, script-like feel). */
  headlineItalic: boolean;
  /** Headline letter-spacing feel: "normal" (elegant serif) or "wide" (bold stacked uppercase). */
  headlineStyle: "serif" | "stacked";
  /** Frame treatment: a single thin hairline, or a double hairline (outer + inner with a gap). */
  frameStyle: "single" | "double";
};

export const QR_DESIGNS: Record<QrDesignKey, QrDesign> = {
  classic: {
    key: "classic",
    label: "Klasik",
    background: "#fdfbf6",
    border: "#cba15c",
    textColor: "#211a12",
    accentColor: "#b8894a",
    qr: { dark: "#211a12", light: "#fdfbf6" },
    motifKey: "sparkle",
    eyebrow: "Skenirajte i podijelite uspomene",
    caption: "Skenirajte i podijelite fotografije",
    headlineItalic: false,
    headlineStyle: "serif",
    frameStyle: "double",
  },
  modern: {
    key: "modern",
    label: "Moderna",
    background: "#ffffff",
    border: "#1f1f1f",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
    qr: { dark: "#111111", light: "#ffffff" },
    motifKey: "none",
    eyebrow: "Skenirajte i podijelite uspomene",
    caption: "Skenirajte kod i podijelite trenutak",
    headlineItalic: false,
    headlineStyle: "stacked",
    frameStyle: "single",
  },
  romantic: {
    key: "romantic",
    label: "Romantika",
    background: "#f3dde1",
    border: "#a24f63",
    textColor: "#5c1a2c",
    accentColor: "#8f2f47",
    qr: { dark: "#5c1a2c", light: "#fbf1f2" },
    motifKey: "heart",
    eyebrow: "Skenirajte i podijelite uspomene",
    caption: "...i uživajte u čarobnim trenucima",
    headlineItalic: false,
    headlineStyle: "serif",
    frameStyle: "single",
  },
  rustic: {
    key: "rustic",
    label: "Rustik",
    background: "#ece0c8",
    border: "#7a5a3a",
    textColor: "#4a3520",
    accentColor: "#6f4e2e",
    qr: { dark: "#3d2b18", light: "#f3ead6" },
    motifKey: "sprig",
    eyebrow: "Skenirajte i podijelite uspomene",
    caption: "Skenirajte i podijelite fotografije",
    headlineItalic: false,
    headlineStyle: "serif",
    frameStyle: "double",
  },
};

export const QR_DESIGN_KEYS = Object.keys(QR_DESIGNS) as QrDesignKey[];

export function isQrDesignKey(value: string): value is QrDesignKey {
  return value in QR_DESIGNS;
}
