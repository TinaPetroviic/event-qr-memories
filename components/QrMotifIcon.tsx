import {
  HEART_GEOMETRY,
  SPARKLE_DOT_RADIUS,
  SPARKLE_RAYS,
  SPRIG_LEAVES,
  SPRIG_STEM,
  leafPathD,
  type QrMotifKey,
} from "@/lib/qrMotifs";

/**
 * Small inline vector ornament rendered on the QR card. Draws the same shape
 * (per theme) as `drawQrMotif` in `lib/qrMotifs.ts`, which paints the printable
 * canvas PNG export - kept as real vector line-art instead of an emoji so it
 * renders identically everywhere, including sandboxes without a color emoji font.
 */
export function QrMotifIcon({
  motifKey,
  color,
  size = 22,
  className,
}: {
  motifKey: QrMotifKey;
  color: string;
  size?: number;
  className?: string;
}) {
  if (motifKey === "none") return null;

  if (motifKey === "sparkle") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        {SPARKLE_RAYS.map((ray, i) => (
          <line
            key={i}
            x1={ray.from[0] + 12}
            y1={ray.from[1] + 12}
            x2={ray.to[0] + 12}
            y2={ray.to[1] + 12}
            stroke={color}
            strokeWidth={ray.width}
            strokeLinecap="round"
          />
        ))}
        <circle cx={12} cy={12} r={SPARKLE_DOT_RADIUS} fill={color} />
      </svg>
    );
  }

  if (motifKey === "heart") {
    const { x, y, w, topCurveHeight } = HEART_GEOMETRY;
    const ox = x + 12;
    const oy = y + 12;
    const d = [
      `M${ox},${oy + topCurveHeight}`,
      `C${ox},${oy} ${ox - w / 2},${oy} ${ox - w / 2},${oy + topCurveHeight}`,
      `C${ox - w / 2},${oy + (w + topCurveHeight) / 2} ${ox},${oy + (w + topCurveHeight) / 2} ${ox},${oy + w}`,
      `C${ox},${oy + (w + topCurveHeight) / 2} ${ox + w / 2},${oy + (w + topCurveHeight) / 2} ${ox + w / 2},${oy + topCurveHeight}`,
      `C${ox + w / 2},${oy} ${ox},${oy} ${ox},${oy + topCurveHeight}`,
      "Z",
    ].join(" ");
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d={d} stroke={color} strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  // sprig
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <line
        x1={SPRIG_STEM.from[0] + 12}
        y1={SPRIG_STEM.from[1] + 12}
        x2={SPRIG_STEM.to[0] + 12}
        y2={SPRIG_STEM.to[1] + 12}
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      {SPRIG_LEAVES.map((leaf, i) => (
        <path key={i} d={leafPathD(leaf)} fill={color} />
      ))}
    </svg>
  );
}
