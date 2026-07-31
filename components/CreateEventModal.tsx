"use client";

import { useActionState, useMemo, useState } from "react";
import { createEvent, type CreateEventState } from "@/app/dashboard/actions";
import { suggestEventSlug } from "@/lib/utils/slug";

const initialState: CreateEventState = {};

export function CreateEventModal() {
  const [open, setOpen] = useState(false);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  const suggestedSlug = useMemo(() => suggestEventSlug(brideName, groomName), [brideName, groomName]);
  const effectiveSlug = slugTouched ? slug : suggestedSlug;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-gold-500 px-6 py-2.5 font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600"
      >
        + Novo vjenčanje
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-cream-50 p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-ink-900">Kreirajte novi događaj</h2>
            <p className="mt-1 text-sm text-ink-700">Unesite osnovne podatke o vašem vjenčanju.</p>

            <form action={formAction} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="brideName" className="mb-1 block text-sm font-medium text-ink-700">
                    Mlada
                  </label>
                  <input
                    id="brideName"
                    name="brideName"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    placeholder="Amina"
                  />
                </div>
                <div>
                  <label htmlFor="groomName" className="mb-1 block text-sm font-medium text-ink-700">
                    Mladoženja
                  </label>
                  <input
                    id="groomName"
                    name="groomName"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full rounded-xl border border-gold-400/40 bg-white px-3 py-2 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    placeholder="Emir"
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
                    value={effectiveSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    className="w-full bg-transparent text-ink-900 outline-none"
                    placeholder="amina-i-emir"
                  />
                </div>
              </div>

              {state.error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-gold-400/40 px-4 py-2.5 font-medium text-ink-700 transition hover:bg-cream-100"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 rounded-full bg-gold-500 px-4 py-2.5 font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600 disabled:opacity-60"
                >
                  {pending ? "Kreiranje..." : "Kreiraj"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
