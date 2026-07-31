import { QrMotifIcon } from "@/components/QrMotifIcon";
import { SPARKLE_DOT_RADIUS, SPARKLE_RAYS } from "@/lib/qrMotifs";
import { CameraIcon, MicrophoneIcon } from "@/components/icons";

// Deterministic decorative QR-style matrix: three viewfinder "finder patterns"
// (the nested-square markers real QR codes use in three corners) plus a
// sparse fixed fill elsewhere, so it reads instantly as "QR code" at a
// glance without being a real, scannable one. Pure function of position, so
// nothing here is random/animated between renders.
const GRID_SIZE = 15;

function isFinderRing(r: number, c: number): boolean {
  return r === 0 || r === 6 || c === 0 || c === 6;
}
function isFinderCore(r: number, c: number): boolean {
  return r >= 2 && r <= 4 && c >= 2 && c <= 4;
}
function isFinderDark(r: number, c: number): boolean {
  return isFinderRing(r, c) || isFinderCore(r, c);
}

function isDark(r: number, c: number): boolean {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c > GRID_SIZE - 8;
  const inBottomLeft = r > GRID_SIZE - 8 && c < 7;
  if (inTopLeft) return isFinderDark(r, c);
  if (inTopRight) return isFinderDark(r, c - (GRID_SIZE - 7));
  if (inBottomLeft) return isFinderDark(r - (GRID_SIZE - 7), c);
  // Quiet gap next to each finder pattern, like real QR codes.
  if (r === 7 || c === 7) return false;
  // Deterministic pseudo-random-looking fill for the "data" area.
  return (r * 7 + c * 13 + r * c * 3) % 5 === 0;
}

const CELLS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
  const r = Math.floor(i / GRID_SIZE);
  const c = i % GRID_SIZE;
  return isDark(r, c);
});

/**
 * Hero-only decorative composition: a tilted "scan me" card built from the
 * same QR/viewfinder visual language as the real printable QR cards
 * (see QRCodeCard.tsx), surrounded by floating chips naming what guests can
 * leave. Deliberately not a photo or stock-image stand-in - this app has no
 * real event photos to show honestly, so the illustration leans on the
 * product's own iconography instead.
 */
export function HeroIllustration() {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-[280px] w-[240px] sm:h-[340px] sm:w-[290px] lg:h-[400px] lg:w-[360px]"
    >
      <div className="absolute -bottom-8 -right-4 h-44 w-44 rounded-full bg-gold-300/15 blur-[80px]" />

      {/* Small sparkle accents echoing the printable QR card's motif set,
          filling the open space around the main card so the composition
          reads as one arrangement rather than a single sticker floating
          in empty air. */}
      <span className="absolute left-2 top-1/2 text-gold-400/70 lg:left-4" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {SPARKLE_RAYS.map((ray, i) => (
            <line
              key={i}
              x1={ray.from[0] + 12}
              y1={ray.from[1] + 12}
              x2={ray.to[0] + 12}
              y2={ray.to[1] + 12}
              stroke="currentColor"
              strokeWidth={ray.width}
              strokeLinecap="round"
            />
          ))}
          <circle cx={12} cy={12} r={SPARKLE_DOT_RADIUS} fill="currentColor" />
        </svg>
      </span>
      {/* Main tilted card */}
      <div className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] rounded-2xl border border-ink-900/10 bg-white/95 p-5 text-center shadow-xl shadow-ink-900/15 backdrop-blur-sm sm:w-[250px] sm:p-6 lg:w-[270px]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-600 sm:text-[10px]">
          Skenirajte kod
        </p>

        <div className="relative mx-auto mt-4 w-fit">
          {/* Viewfinder corner brackets, matching the printable QR card's style */}
          <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-gold-500 sm:h-5 sm:w-5" />
          <span className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-gold-500 sm:h-5 sm:w-5" />
          <span className="pointer-events-none absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-gold-500 sm:h-5 sm:w-5" />
          <span className="pointer-events-none absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-gold-500 sm:h-5 sm:w-5" />

          <div
            className="grid gap-[1px] rounded-md bg-ink-900 p-2 sm:p-2.5"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {CELLS.map((dark, i) => (
              <div
                key={i}
                className={`h-[3.5px] w-[3.5px] sm:h-1 sm:w-1 ${dark ? "bg-cream-50" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-ink-700 sm:text-xs">
          Fotografija · video · glasovna poruka
        </p>
      </div>

      {/* Floating chip: photo */}
      <div className="absolute -left-2 top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink-900 shadow-md shadow-ink-900/10 sm:-left-4 sm:top-6 sm:text-xs">
        <CameraIcon className="h-3.5 w-3.5" aria-hidden />
        Fotografija
      </div>

      {/* Floating chip: voice message */}
      <div className="absolute -right-3 bottom-8 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink-900 shadow-md shadow-ink-900/10 sm:-right-5 sm:bottom-12 sm:text-xs">
        <MicrophoneIcon className="h-3.5 w-3.5" aria-hidden />
        Poruka
      </div>

      {/* Small vector flourish, echoing the printable card's motif options */}
      <div className="absolute -right-1 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 shadow-sm shadow-blush-500/20 sm:h-10 sm:w-10">
        <QrMotifIcon motifKey="heart" color="#863a4c" size={16} />
      </div>
    </div>
  );
}
