// Small lookup for an event's category, used by the create-event form, the
// dashboard cards and the admin panel header. Deliberately simpler than
// lib/qrDesigns.ts's QrDesign records - each category only needs a label and
// an icon key (resolved to a component via components/icons.tsx#Icon), no
// vector art or printable-card styling.

import type { IconName } from "@/components/icons";

export type EventTypeKey = "wedding" | "birthday" | "anniversary" | "corporate" | "graduation" | "other";

export type EventTypeInfo = {
  key: EventTypeKey;
  label: string;
  icon: IconName;
};

export const EVENT_TYPES: Record<EventTypeKey, EventTypeInfo> = {
  wedding: { key: "wedding", label: "Vjenčanje", icon: "rings" },
  birthday: { key: "birthday", label: "Rođendan", icon: "cake" },
  anniversary: { key: "anniversary", label: "Godišnjica", icon: "champagne" },
  corporate: { key: "corporate", label: "Poslovni događaj", icon: "building" },
  graduation: { key: "graduation", label: "Matura ili diploma", icon: "graduationCap" },
  other: { key: "other", label: "Ostalo", icon: "sparkle" },
};

export const EVENT_TYPE_KEYS = Object.keys(EVENT_TYPES) as EventTypeKey[];

export function isEventTypeKey(value: string): value is EventTypeKey {
  return value in EVENT_TYPES;
}
