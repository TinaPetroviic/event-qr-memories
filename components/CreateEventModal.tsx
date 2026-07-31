"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createEvent, type CreateEventState } from "@/app/dashboard/actions";
import { suggestEventSlug } from "@/lib/utils/slug";
import { EVENT_TYPE_KEYS, EVENT_TYPES, type EventTypeKey } from "@/lib/eventTypes";
import { ChevronDownIcon, PlusIcon } from "@/components/icons";

const initialState: CreateEventState = {};

export function CreateEventModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [eventType, setEventType] = useState<EventTypeKey | "">("");
  const [eventTypeMenuOpen, setEventTypeMenuOpen] = useState(false);
  const eventTypeRef = useRef<HTMLDivElement | null>(null);
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  const suggestedSlug = useMemo(() => suggestEventSlug(title), [title]);
  const effectiveSlug = slugTouched ? slug : suggestedSlug;

  // Native <select> popups are drawn by the OS/browser, not by our CSS, so
  // their option list can't reliably match the app's own styling. This
  // dropdown is a plain button + absolutely-positioned listbox instead, kept
  // in sync with a hidden input so the form still submits "eventType" the
  // same way a native select would.
  useEffect(() => {
    if (!eventTypeMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (eventTypeRef.current && !eventTypeRef.current.contains(e.target as Node)) {
        setEventTypeMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setEventTypeMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [eventTypeMenuOpen]);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary px-6 py-2.5">
        <PlusIcon className="h-5 w-5" aria-hidden /> Novi događaj
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 px-4 py-8 backdrop-blur-md animate-fade-up overflow-y-auto"
            style={{ animationDuration: "0.2s" }}
            onClick={closeModal}
          >
          <div
            className="animate-scale-in my-auto w-full max-w-2xl rounded-3xl border border-gold-400/20 bg-cream-50 p-6 shadow-2xl sm:p-8"
            style={{ animationDuration: "0.3s" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">Novi početak</p>
            <h2 className="mt-3 font-display text-2xl text-ink-900">Kreirajte novi događaj</h2>
            <p className="mt-1 text-sm text-ink-700">Unesite osnovne podatke o vašem događaju.</p>

            <form action={formAction} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div ref={eventTypeRef} className="relative">
                      <label id="eventTypeLabel" className="mb-1 block text-sm font-medium text-ink-700">
                        Vrsta događaja
                      </label>
                      <input type="hidden" name="eventType" value={eventType} />
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={eventTypeMenuOpen}
                        aria-labelledby="eventTypeLabel"
                        onClick={() => setEventTypeMenuOpen((v) => !v)}
                        className={`input-field flex w-full items-center justify-between px-3 py-2 text-left ${
                          eventType === "" ? "text-ink-700/50" : "text-ink-900"
                        }`}
                      >
                        {eventType === "" ? "Odaberite vrstu događaja" : EVENT_TYPES[eventType].label}
                        <ChevronDownIcon
                          className={`h-4 w-4 shrink-0 text-ink-700/60 transition-transform ${
                            eventTypeMenuOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>

                      {eventTypeMenuOpen && (
                        <ul
                          role="listbox"
                          aria-labelledby="eventTypeLabel"
                          className="animate-fade-up absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-gold-400/30 bg-white py-1.5 shadow-lg shadow-gold-600/10"
                          style={{ animationDuration: "0.15s" }}
                        >
                          {EVENT_TYPE_KEYS.map((key) => (
                            <li key={key} role="option" aria-selected={eventType === key}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEventType(key);
                                  setEventTypeMenuOpen(false);
                                }}
                                className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-cream-100 ${
                                  eventType === key ? "font-medium text-gold-600" : "text-ink-900"
                                }`}
                              >
                                {EVENT_TYPES[key].label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
                  </div>

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
                      placeholder="npr. Nina & Marko"
                    />
                    <p className="mt-1.5 text-xs text-ink-700/60">
                      Imena, rođendan, godišnjica tvrtke – što god slavite.
                    </p>
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
                        placeholder="nina-i-marko"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-ink-700/60">Ovo je link koji dijelite s gostima.</p>
                  </div>

              <label className="flex items-center gap-3 rounded-xl border border-gold-400/30 bg-cream-100/60 px-4 py-3">
                <input
                  type="checkbox"
                  name="galleryPublic"
                  className="h-4 w-4 accent-gold-500"
                />
                <span className="text-sm text-ink-900">
                  Javna galerija{" "}
                  <span className="text-ink-700">- svi posjetitelji linka mogu vidjeti sve fotografije</span>
                </span>
              </label>

              {state.error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-full border border-gold-400/40 px-4 py-2.5 font-medium text-ink-700 transition hover:bg-cream-100 active:scale-[0.98]"
                >
                  Odustani
                </button>
                <button type="submit" disabled={pending} className="btn-primary flex-1 px-4 py-2.5">
                  {pending ? "Kreiranje..." : "Kreiraj"}
                </button>
              </div>
            </form>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
