// Small lookup for an event's category, used by the create-event form, the
// dashboard cards and the admin panel header. Deliberately simpler than
// lib/qrDesigns.ts's QrDesign records - each category only needs a label and
// an emoji icon, no vector art or printable-card styling.

export type EventTypeKey = "wedding" | "birthday" | "anniversary" | "corporate" | "graduation" | "other";

export type EventTypeInfo = {
  key: EventTypeKey;
  label: string;
  icon: string;
};

export const EVENT_TYPES: Record<EventTypeKey, EventTypeInfo> = {
  wedding: { key: "wedding", label: "Vjenčanje", icon: "💍" },
  birthday: { key: "birthday", label: "Rođendan", icon: "🎂" },
  anniversary: { key: "anniversary", label: "Godišnjica", icon: "💐" },
  corporate: { key: "corporate", label: "Poslovni događaj", icon: "🏢" },
  graduation: { key: "graduation", label: "Matura ili diploma", icon: "🎓" },
  other: { key: "other", label: "Ostalo", icon: "✨" },
};

export const EVENT_TYPE_KEYS = Object.keys(EVENT_TYPES) as EventTypeKey[];

export function isEventTypeKey(value: string): value is EventTypeKey {
  return value in EVENT_TYPES;
}
