// Shared minimal line-icon set, replacing the emoji characters that used to
// stand in for icons throughout the app. Every icon is a stroke-based 24x24
// SVG using `currentColor`, so it inherits the surrounding text/accent color
// and sizes cleanly via Tailwind (`h-4 w-4`, `h-6 w-6`, ...) instead of
// depending on the OS/browser's color emoji font.
//
// `SparkleIcon` and `HeartIcon` reuse the exact ray/heart geometry already
// defined in lib/qrMotifs.ts (used by the printable QR card), so the same
// "sparkle" and "heart" motif reads identically whether it shows up as a
// small UI icon or as a QR card ornament.
//
// `Icon` is a small key -> component lookup (the same "per-key visual
// lookup" pattern already used by QrMotifIcon/QR_DESIGNS) so data files like
// lib/eventTypes.ts can store a plain, serializable `IconName` string
// instead of importing a component.

import type { SVGProps } from "react";
import { HEART_GEOMETRY, SPARKLE_DOT_RADIUS, SPARKLE_RAYS } from "@/lib/qrMotifs";

export type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 8.7a1.5 1.5 0 0 1 1.5-1.5h1.15l1-1.5A1.4 1.4 0 0 1 8.83 5h6.34a1.4 1.4 0 0 1 1.18.7l1 1.5h1.15A1.5 1.5 0 0 1 20 8.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
      <circle cx="12" cy="13" r="3.1" />
    </Base>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 10.3l4.6-2.6a.8.8 0 0 1 1.2.7v7.2a.8.8 0 0 1-1.2.7L15 13.7z" />
    </Base>
  );
}

export function MicrophoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9" y="3.5" width="6" height="10.5" rx="3" />
      <path d="M6 11.2v.8a6 6 0 0 0 12 0v-.8" />
      <path d="M12 18v2.5" />
      <path d="M8.75 20.5h6.5" />
    </Base>
  );
}

export function HeadphonesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </Base>
  );
}

export function HeartIcon(props: IconProps) {
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
    <Base {...props}>
      <path d={d} />
    </Base>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props}>
      {SPARKLE_RAYS.map((ray, i) => (
        <line
          key={i}
          x1={ray.from[0] + 12}
          y1={ray.from[1] + 12}
          x2={ray.to[0] + 12}
          y2={ray.to[1] + 12}
          strokeWidth={ray.width * 1.6}
        />
      ))}
      <circle cx={12} cy={12} r={SPARKLE_DOT_RADIUS} fill="currentColor" stroke="none" />
    </Base>
  );
}

export function RingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
    </Base>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20.5h16" />
      <rect x="5" y="13" width="14" height="7.5" rx="1.5" />
      <path d="M5 16.2c1.15-.9 2.3-.9 3.45 0s2.3.9 3.45 0 2.3-.9 3.45 0 2.3.9 3.45 0" />
      <path d="M9 13v-2.6M12 13v-3.2M15 13v-2.6" />
      <path d="M9 9c.55-.55.55-1.1 0-1.65M12 7.9c.55-.55.55-1.1 0-1.65M15 9c.55-.55.55-1.1 0-1.65" />
    </Base>
  );
}

export function ChampagneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <g transform="translate(7.3,10) rotate(-18)">
        <path d="M-3.3,-7 L3.3,-7 L0,-1 Z" />
        <path d="M0,-1V4" />
        <path d="M-2.1,4H2.1" />
      </g>
      <g transform="translate(16.7,10) rotate(18)">
        <path d="M-3.3,-7 L3.3,-7 L0,-1 Z" />
        <path d="M0,-1V4" />
        <path d="M-2.1,4H2.1" />
      </g>
    </Base>
  );
}

export function DoveIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="1.15" fill="currentColor" stroke="none" />
      <path d="M12 9.3c-2.6-3-5.9-3.6-8.8-2 1.7 2.5 4.4 3.5 7.3 2.9-.55 1.6-1.9 2.9-3.6 3.5 2.9.7 5.8-.3 7.5-2.5" />
      <path d="M12 9.3c2.6-3 5.9-3.6 8.8-2-1.7 2.5-4.4 3.5-7.3 2.9.55 1.6 1.9 2.9 3.6 3.5-2.9.7-5.8-.3-7.5-2.5" />
    </Base>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 9L12 4.3 22 9l-10 4.7z" />
      <path d="M6.5 11.2v4.3c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.3" />
      <path d="M20.5 9.7v5" />
    </Base>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="3.5" width="10" height="17" rx="1" />
      <rect x="15" y="9.5" width="4.5" height="11" rx="1" />
      <path d="M8 7.2h1M11 7.2h1M8 10.4h1M11 10.4h1M8 13.6h1M11 13.6h1M8 16.8h1M11 16.8h1" />
      <path d="M17 12.6h.75M17 15.6h.75" />
    </Base>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M4 7l8 6.2L20 7" />
    </Base>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.7 14.3l4.6-4.6" />
      <path d="M7.9 10.4l-1.5 1.5a3 3 0 0 0 4.2 4.2l1.8-1.8" />
      <path d="M16.1 13.6l1.5-1.5a3 3 0 0 0-4.2-4.2l-1.8 1.8" />
    </Base>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.85-.8 1.85-1.85 0-.47-.18-.87-.47-1.2-.3-.34-.47-.75-.47-1.17 0-.85.7-1.48 1.55-1.48h1.79a3.75 3.75 0 0 0 3.75-3.75c0-4.15-3.6-7.55-8-7.55z" />
      <circle cx="7.6" cy="10.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.6" cy="7.3" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.1" cy="7.3" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.4" cy="10.2" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M7.75 10.5V8a4.25 4.25 0 0 1 8.5 0v2.5" />
      <circle cx="12" cy="14.8" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 16v1.6" />
    </Base>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 9.7h16" />
      <path d="M8 3.5v3.4M16 3.5v3.4" />
    </Base>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="4.5" width="12" height="16" rx="2" />
      <rect x="9" y="3" width="6" height="3" rx="1" />
      <path d="M9 10.5h6M9 14h6M9 17.5h3.5" />
    </Base>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="8.5" cy="9.7" r="1.6" />
      <path d="M4 17l5-5 3.4 3.4L16.3 11 20 14.7" />
    </Base>
  );
}

export function LayoutGridIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.3" />
      <rect x="13" y="4" width="7" height="7" rx="1.3" />
      <rect x="4" y="13" width="7" height="7" rx="1.3" />
      <rect x="13" y="13" width="7" height="7" rx="1.3" />
    </Base>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.1M12 18.4v2.1M20.5 12h-2.1M5.6 12H3.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5M17.7 17.7l-1.5-1.5M7.8 7.8L6.3 6.3" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Base>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14.5 5l-7 7 7 7" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 5l7 7-7 7" />
    </Base>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 15.5V4.5" />
      <path d="M7.5 9L12 4.5 16.5 9" />
      <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    </Base>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4.5v11" />
      <path d="M7.5 11l4.5 4.5L16.5 11" />
      <path d="M5 18.5h14" />
    </Base>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export const ICONS = {
  camera: CameraIcon,
  video: VideoIcon,
  microphone: MicrophoneIcon,
  headphones: HeadphonesIcon,
  heart: HeartIcon,
  sparkle: SparkleIcon,
  rings: RingsIcon,
  cake: CakeIcon,
  champagne: ChampagneIcon,
  dove: DoveIcon,
  graduationCap: GraduationCapIcon,
  building: BuildingIcon,
  mail: MailIcon,
  link: LinkIcon,
  palette: PaletteIcon,
  lock: LockIcon,
  calendar: CalendarIcon,
  clipboard: ClipboardIcon,
  image: ImageIcon,
  layoutGrid: LayoutGridIcon,
  settings: SettingsIcon,
  check: CheckIcon,
  close: CloseIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  plus: PlusIcon,
} as const satisfies Record<string, (props: IconProps) => React.JSX.Element>;

export type IconName = keyof typeof ICONS;

/** Generic key -> icon lookup, for data files that store a plain, serializable icon key. */
export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Component = ICONS[name];
  return <Component {...props} />;
}
