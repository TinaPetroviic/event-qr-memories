// Shared QR-card design definitions used by both the settings picker
// (components/EventSettingsForm.tsx) and the card renderer
// (components/QRCodeCard.tsx), so the two stay in sync.
//
// "classic" reproduces the app's original cream/gold look so existing events
// don't visually change unless the couple explicitly picks another design.

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
  /** Secondary/accent color (date, buttons, ornament). */
  accentColor: string;
  /** Colors handed to the `qrcode` library - needs enough contrast to scan reliably. */
  qr: { dark: string; light: string };
  /** Small decorative motif rendered on the card. */
  motif: string;
};

export const QR_DESIGNS: Record<QrDesignKey, QrDesign> = {
  classic: {
    key: "classic",
    label: "Klasik",
    background: "#fdfbf6",
    border: "#cba15c",
    textColor: "#2e2419",
    accentColor: "#b8894a",
    qr: { dark: "#2e2419", light: "#fdfbf6" },
    motif: "✦",
  },
  modern: {
    key: "modern",
    label: "Moderna",
    background: "#ffffff",
    border: "#1f1f1f",
    textColor: "#1a1a1a",
    accentColor: "#3a3a3a",
    qr: { dark: "#111111", light: "#ffffff" },
    motif: "—",
  },
  romantic: {
    key: "romantic",
    label: "Romantika",
    background: "#fbeaee",
    border: "#c26478",
    textColor: "#6b1f34",
    accentColor: "#b23b5a",
    qr: { dark: "#6b1f34", light: "#fdf2f4" },
    motif: "♥",
  },
  rustic: {
    key: "rustic",
    label: "Rustik",
    background: "#ece0c8",
    border: "#7a5a3a",
    textColor: "#4a3520",
    accentColor: "#6f4e2e",
    qr: { dark: "#3d2b18", light: "#f3ead6" },
    motif: "🌿",
  },
};

export const QR_DESIGN_KEYS = Object.keys(QR_DESIGNS) as QrDesignKey[];

export function isQrDesignKey(value: string): value is QrDesignKey {
  return value in QR_DESIGNS;
}
