"use client";

import { useActionState, useState } from "react";
import { updateEventSettings, type SettingsFormState } from "@/app/dashboard/events/[id]/actions";
import type { EventRow } from "@/lib/database.types";
import { QR_DESIGNS, QR_DESIGN_KEYS } from "@/lib/qrDesigns";

const initialState: SettingsFormState = {};

export function EventSettingsForm({ event }: { event: EventRow }) {
  const action = updateEventSettings.bind(null, event.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [qrDesign, setQrDesign] = useState(event.qr_design);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink-700">
          Naziv događaja
        </label>
        <input
          id="title"
          name="title"
          defaultValue={event.title}
          required
          className="input-field px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="eventDate" className="mb-1 block text-sm font-medium text-ink-700">
          Datum događaja
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          defaultValue={event.event_date}
          required
          className="input-field px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink-700">
          Link za goste
        </label>
        <div className="flex items-center rounded-xl border border-gold-400/40 bg-white px-3 py-2 focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-400/30">
          <span className="whitespace-nowrap text-sm text-ink-700/60">/e/</span>
          <input
            id="slug"
            name="slug"
            defaultValue={event.slug}
            required
            className="w-full bg-transparent text-ink-900 outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="welcomeMessage" className="mb-1 block text-sm font-medium text-ink-700">
          Poruka dobrodošlice za goste
        </label>
        <textarea
          id="welcomeMessage"
          name="welcomeMessage"
          defaultValue={event.welcome_message}
          rows={3}
          className="input-field px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-gold-400/30 bg-cream-100/60 px-4 py-3">
        <input
          type="checkbox"
          name="galleryPublic"
          defaultChecked={event.gallery_public}
          className="h-4 w-4 accent-gold-500"
        />
        <span className="text-sm text-ink-900">
          Javna galerija{" "}
          <span className="text-ink-700">- svi posjetitelji linka mogu vidjeti sve fotografije</span>
        </span>
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium text-ink-700">Dizajn QR kartice</span>
        <p className="mb-3 text-xs text-ink-500">Odaberite izgled kartice koju gosti vide kada skeniraju kod.</p>
        <input type="hidden" name="qrDesign" value={qrDesign} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QR_DESIGN_KEYS.map((key) => {
            const option = QR_DESIGNS[key];
            const selected = qrDesign === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setQrDesign(key)}
                className={`relative rounded-2xl border-2 p-4 text-center transition ${
                  selected
                    ? "shadow-md"
                    : "border-transparent shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                }`}
                style={{
                  background: option.background,
                  borderColor: selected ? option.accentColor : option.border + "55",
                }}
                aria-pressed={selected}
              >
                {selected && (
                  <span
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                    style={{ background: option.accentColor }}
                    aria-hidden
                  >
                    ✓
                  </span>
                )}
                <div
                  className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-base shadow-sm"
                  style={{ background: option.accentColor, color: option.background }}
                >
                  {option.motif}
                </div>
                <span
                  className="mb-2 block h-8 w-full rounded-md"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${option.qr.dark} 0, ${option.qr.dark} 2px, ${option.qr.light} 2px, ${option.qr.light} 5px)`,
                    border: `1px solid ${option.qr.dark}22`,
                  }}
                  aria-hidden
                />
                <span className="text-sm font-medium" style={{ color: option.textColor }}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">Postavke su spremljene.</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
        {pending ? "Spremanje..." : "Spremi postavke"}
      </button>
    </form>
  );
}
