// Small vector line-art ornaments used on the printable QR card, replacing
// plain emoji/text motifs (which depend on the OS/browser's color emoji font
// and can render as flat glyphs or missing-glyph "tofu" boxes when exported
// to a canvas PNG for printing).
//
// Each shape's geometry is defined once, centered on the origin (0,0), so the
// on-screen SVG (components/QrMotifIcon.tsx) and the canvas PNG export
// (components/QRCodeCard.tsx) draw the exact same shape - just through
// different rendering APIs. To place a shape in a conventional 24x24 SVG
// viewBox, add 12 to every coordinate; the canvas drawing functions below
// consume the centered coordinates directly after translating to the target
// center point.

export type QrMotifKey = "sparkle" | "heart" | "sprig" | "none";

type Point = readonly [number, number];

/** Thin radiating rays + a tiny center dot - a restrained sparkle/star-burst, not a solid star. */
export const SPARKLE_RAYS: ReadonlyArray<{ from: Point; to: Point; width: number }> = [
  { from: [0, -9.5], to: [0, -3], width: 1.1 },
  { from: [0, 3], to: [0, 9.5], width: 1.1 },
  { from: [-9.5, 0], to: [-3, 0], width: 1.1 },
  { from: [3, 0], to: [9.5, 0], width: 1.1 },
  { from: [-6.7, -6.7], to: [-2.3, -2.3], width: 0.9 },
  { from: [2.3, 2.3], to: [6.7, 6.7], width: 0.9 },
  { from: [6.7, -6.7], to: [2.3, -2.3], width: 0.9 },
  { from: [-2.3, 2.3], to: [-6.7, 6.7], width: 0.9 },
];
export const SPARKLE_DOT_RADIUS = 1.3;

/** A rounded, stroke-only heart outline (no fill) - deliberately not an emoji heart. */
export const HEART_GEOMETRY = {
  // Anchor + width for the classic "two lobes + point" bezier heart formula.
  x: 0,
  y: -6.5,
  w: 13,
  topCurveHeight: 3.9,
};

/** A small leaf/petal shape: a lens between a base and tip point, bulging to one side. */
export type Leaf = { base: Point; tip: Point; bulge: number };

// A symmetric stem + leaf-pair + tip-leaf silhouette - reads clearly as a
// small botanical sprig even at ~20px, unlike an asymmetric branch would.
export const SPRIG_STEM: { from: Point; to: Point } = { from: [0, 8], to: [0, -6.5] };
export const SPRIG_LEAVES: ReadonlyArray<Leaf> = [
  { base: [0, 2.7], tip: [-6.5, -1.3], bulge: 2.6 },
  { base: [0, 2.7], tip: [6.5, -1.3], bulge: 2.6 },
  { base: [0, -6.5], tip: [0, -10.2], bulge: 1.5 },
];

/** Builds an SVG path `d` string for a lens-shaped leaf between two points. */
export function leafPathD(leaf: Leaf, offsetX = 12, offsetY = 12): string {
  const [bx, by] = leaf.base;
  const [tx, ty] = leaf.tip;
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = (-dy / len) * leaf.bulge;
  const ny = (dx / len) * leaf.bulge;
  const midX = (bx + tx) / 2;
  const midY = (by + ty) / 2;
  const c1x = midX + nx + offsetX;
  const c1y = midY + ny + offsetY;
  const c2x = midX - nx + offsetX;
  const c2y = midY - ny + offsetY;
  const b = `${bx + offsetX},${by + offsetY}`;
  const t = `${tx + offsetX},${ty + offsetY}`;
  return `M${b} Q${c1x},${c1y} ${t} Q${c2x},${c2y} ${b} Z`;
}

function leafPathOnCanvas(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  const [bx, by] = leaf.base;
  const [tx, ty] = leaf.tip;
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = (-dy / len) * leaf.bulge;
  const ny = (dx / len) * leaf.bulge;
  const midX = (bx + tx) / 2;
  const midY = (by + ty) / 2;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(midX + nx, midY + ny, tx, ty);
  ctx.quadraticCurveTo(midX - nx, midY - ny, bx, by);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws a motif centered at (cx, cy), scaled so its ~24-unit design grid maps
 * onto `size` px. Mirrors the shapes rendered by <QrMotifIcon> on screen.
 */
export function drawQrMotif(
  ctx: CanvasRenderingContext2D,
  motifKey: QrMotifKey,
  cx: number,
  cy: number,
  size: number,
  color: string,
) {
  if (motifKey === "none") return;

  ctx.save();
  ctx.translate(cx, cy);
  const scale = size / 24;
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (motifKey === "sparkle") {
    for (const ray of SPARKLE_RAYS) {
      ctx.lineWidth = ray.width;
      ctx.beginPath();
      ctx.moveTo(ray.from[0], ray.from[1]);
      ctx.lineTo(ray.to[0], ray.to[1]);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, SPARKLE_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  } else if (motifKey === "heart") {
    const { x, y, w, topCurveHeight } = HEART_GEOMETRY;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - w / 2, y, x - w / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - w / 2, y + (w + topCurveHeight) / 2, x, y + (w + topCurveHeight) / 2, x, y + w);
    ctx.bezierCurveTo(x, y + (w + topCurveHeight) / 2, x + w / 2, y + (w + topCurveHeight) / 2, x + w / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.stroke();
  } else if (motifKey === "sprig") {
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(SPRIG_STEM.from[0], SPRIG_STEM.from[1]);
    ctx.lineTo(SPRIG_STEM.to[0], SPRIG_STEM.to[1]);
    ctx.stroke();
    for (const leaf of SPRIG_LEAVES) {
      leafPathOnCanvas(ctx, leaf);
    }
  }

  ctx.restore();
}
