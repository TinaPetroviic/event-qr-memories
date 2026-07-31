"use client";

import { useActionState } from "react";
import { updateEventSettings, type SettingsFormState } from "@/app/dashboard/events/[id]/actions";
import type { EventRow } from "@/lib/database.types";
import { DeleteEventButton } from "@/components/DeleteEventButton";

const initialState: SettingsFormState = {};

export function EventSettingsForm({ event }: { event: EventRow }) {
  const action = updateEventSettings.bind(null, event.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-8">
        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">Osnovni podaci</p>

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
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/25 to-transparent" />

        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">Poruka i galerija</p>

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
        </div>

        {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
        {state.success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">Postavke su spremljene.</p>
        )}

        <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
          {pending ? "Spremanje..." : "Spremi postavke"}
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <p className="text-sm font-medium text-red-900">Opasna zona</p>
        <p className="mt-1 text-xs text-red-700/80">
          Brisanje događaja je trajno i uklanja sve fotografije, videa i glasovne poruke koje su gosti podijelili.
        </p>
        <div className="mt-3">
          <DeleteEventButton eventId={event.id} />
        </div>
      </div>
    </div>
  );
}
