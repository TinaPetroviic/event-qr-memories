"use client";

import { useActionState } from "react";
import { updateEventSettings, type SettingsFormState } from "@/app/dashboard/events/[id]/actions";
import type { EventRow } from "@/lib/database.types";

const initialState: SettingsFormState = {};

export function EventSettingsForm({ event }: { event: EventRow }) {
  const action = updateEventSettings.bind(null, event.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="brideName" className="mb-1 block text-sm font-medium text-ink-700">
            Mlada
          </label>
          <input
            id="brideName"
            name="brideName"
            defaultValue={event.bride_name}
            required
            className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>
        <div>
          <label htmlFor="groomName" className="mb-1 block text-sm font-medium text-ink-700">
            Mladoženja
          </label>
          <input
            id="groomName"
            name="groomName"
            defaultValue={event.groom_name}
            required
            className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="weddingDate" className="mb-1 block text-sm font-medium text-ink-700">
          Datum vjenčanja
        </label>
        <input
          id="weddingDate"
          name="weddingDate"
          type="date"
          defaultValue={event.wedding_date}
          required
          className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
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
          className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
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

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">Postavke su spremljene.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold-500 px-6 py-2.5 font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600 disabled:opacity-60"
      >
        {pending ? "Spremanje..." : "Spremi postavke"}
      </button>
    </form>
  );
}
