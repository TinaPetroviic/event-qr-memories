"use client";

import { useActionState, useMemo, useState } from "react";
import { createEvent, type CreateEventState } from "@/app/dashboard/actions";
import { suggestEventSlug } from "@/lib/utils/slug";

const initialState: CreateEventState = {};

export function CreateEventModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  const suggestedSlug = useMemo(() => suggestEventSlug(title), [title]);
  const effectiveSlug = slugTouched ? slug : suggestedSlug;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary px-6 py-2.5">
        <span aria-hidden>+</span> Novi događaj
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-sm animate-fade-up"
          style={{ animationDuration: "0.2s" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gold-400/20 bg-cream-50 p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
              <span>Novi početak</span>
            </p>
            <h2 className="mt-3 font-display text-2xl text-ink-900">Kreirajte novi događaj</h2>
            <p className="mt-1 text-sm text-ink-700">Unesite osnovne podatke o vašem događaju.</p>

            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink-700">
                  Naziv događaja
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field px-3 py-2"
                  placeholder="Nina & Marko, Rođendan Amele, 10 godina firme..."
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
                    value={effectiveSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    className="w-full bg-transparent text-ink-900 outline-none"
                    placeholder="nina-marko"
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
                <button type="submit" disabled={pending} className="btn-primary flex-1 px-4 py-2.5">
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
