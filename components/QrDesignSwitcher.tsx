"use client";

import { useState, useTransition } from "react";
import { updateQrDesign } from "@/app/dashboard/events/[id]/actions";
import { QR_DESIGNS, QR_DESIGN_KEYS, type QrDesignKey } from "@/lib/qrDesigns";
import { QrMotifIcon } from "@/components/QrMotifIcon";
import { CheckIcon } from "@/components/icons";

/**
 * Compact swatch row shown directly under the live QR card (see
 * QrShareCard) so picking a theme here updates the actual card immediately -
 * no need to jump to Postavke and back just to see the result.
 */
export function QrDesignSwitcher({
  eventId,
  design,
  onChange,
}: {
  eventId: string;
  design: QrDesignKey;
  onChange: (design: QrDesignKey) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (key: QrDesignKey) => {
    if (key === design || isPending) return;
    const previous = design;
    setError(null);
    onChange(key); // optimistic - the QR card re-renders with the new theme right away
    startTransition(async () => {
      const result = await updateQrDesign(eventId, key);
      if (result?.error) {
        setError(result.error);
        onChange(previous);
      }
    });
  };

  return (
    <div className="card-surface flex flex-wrap items-center gap-3 p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">Dizajn kartice</p>
      <div className="flex items-center gap-2.5">
        {QR_DESIGN_KEYS.map((key) => {
          const option = QR_DESIGNS[key];
          const selected = design === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              disabled={isPending}
              aria-pressed={selected}
              aria-label={option.label}
              title={option.label}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition active:scale-[0.94] disabled:pointer-events-none disabled:opacity-70 ${
                selected ? "" : "border-transparent hover:-translate-y-0.5 hover:shadow-md"
              }`}
              style={{
                background: option.background,
                borderColor: selected ? option.accentColor : option.border + "55",
              }}
            >
              {option.motifKey === "none" ? (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: option.accentColor }} aria-hidden />
              ) : (
                <QrMotifIcon motifKey={option.motifKey} color={option.accentColor} size={16} />
              )}
              {selected && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
                  style={{ background: option.accentColor }}
                  aria-hidden
                >
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {isPending && <span className="text-xs text-ink-500">Spremanje...</span>}
      {error && <p className="w-full text-xs text-red-700">{error}</p>}
    </div>
  );
}
