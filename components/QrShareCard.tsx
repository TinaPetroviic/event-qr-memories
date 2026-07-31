"use client";

import { useState } from "react";
import { QRCodeCard } from "@/components/QRCodeCard";
import { QrDesignSwitcher } from "@/components/QrDesignSwitcher";
import type { QrDesignKey } from "@/lib/qrDesigns";

/**
 * Pairs the live QR card with its theme switcher so the two always travel
 * together: changing a swatch here re-renders the actual card above it
 * immediately, instead of leaving the couple to guess how a theme looks by
 * reading abstract swatches on a different tab (see the now-removed design
 * picker in EventSettingsForm).
 */
export function QrShareCard({
  eventId,
  slug,
  title,
  eventDate,
  initialDesign,
}: {
  eventId: string;
  slug: string;
  title: string;
  eventDate: string;
  initialDesign: QrDesignKey;
}) {
  const [design, setDesign] = useState(initialDesign);

  return (
    <div className="flex h-full flex-col gap-4">
      <QRCodeCard slug={slug} title={title} eventDate={eventDate} design={design} />
      <QrDesignSwitcher eventId={eventId} design={design} onChange={setDesign} />
    </div>
  );
}
