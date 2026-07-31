"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createEvent, type CreateEventState } from "@/app/dashboard/actions";
import { suggestEventSlug } from "@/lib/utils/slug";
import { EVENT_TYPE_KEYS, EVENT_TYPES, type EventTypeKey } from "@/lib/eventTypes";
import { ClipboardIcon, ImageIcon, PlusIcon, UploadIcon } from "@/components/icons";

const initialState: CreateEventState = {};

export function CreateEventModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [eventType, setEventType] = useState<EventTypeKey | "">("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  const suggestedSlug = useMemo(() => suggestEventSlug(title), [title]);
  const effectiveSlug = slugTouched ? slug : suggestedSlug;

  const handleCoverChange = (file: File | null) => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    if (!file) {
      setCoverPreview(null);
      setCoverFileName(null);
      return;
    }
    setCoverPreview(URL.createObjectURL(file));
    setCoverFileName(file.name);
  };

  const clearCover = () => {
    handleCoverChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    clearCover();
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

            <form action={formAction} className="mt-6 space-y-6">
              {/* Section A: basic event details */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                    <ClipboardIcon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink-900">Osnovni podaci o događaju</h3>
                    <p className="text-xs text-ink-700/70">Vrsta, naziv, datum i link koji dijelite s gostima.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="eventType" className="mb-1 block text-sm font-medium text-ink-700">
                        Vrsta događaja
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventTypeKey)}
                        className={`input-field px-3 py-2 ${eventType === "" ? "text-ink-700/50" : "text-ink-900"}`}
                      >
                        <option value="" disabled className="text-ink-700">
                          Odaberite vrstu događaja
                        </option>
                        {/* Native <option> elements can only render text, not
                            SVG icons, so this dropdown intentionally shows the
                            label only - the icon shows up everywhere else this
                            event type is displayed (dashboard cards, admin
                            panel header). */}
                        {EVENT_TYPE_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {EVENT_TYPES[key].label}
                          </option>
                        ))}
                      </select>
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
                </div>
              </div>

              <div className="border-t border-gold-400/15" />

              {/* Section B: optional cover image */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                    <ImageIcon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink-900">Naslovna fotografija</h3>
                    <p className="text-xs text-ink-700/70">
                      Opcionalno. Prikazuje se gostima i na vašoj nadzornoj ploči.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
                  />

                  {coverPreview ? (
                    <div className="card-surface relative overflow-hidden">
                      {/* Preview of a couple's own chosen upload before submit. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverPreview} alt="Pregled naslovne fotografije" className="h-40 w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 p-3">
                        <p className="truncate text-xs text-ink-700">{coverFileName}</p>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-full border border-gold-400/40 px-3 py-1 text-xs font-medium text-ink-700 transition hover:bg-cream-100 active:scale-95"
                          >
                            Promijeni
                          </button>
                          <button
                            type="button"
                            onClick={clearCover}
                            className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 active:scale-95"
                          >
                            Ukloni
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-gold-400/40 bg-white/50 px-4 py-3 text-left transition hover:border-gold-500 hover:bg-cream-100 active:scale-[0.99]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                        <UploadIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink-900">Dodirnite za učitavanje</span>
                        <span className="block text-xs text-ink-700/60">JPG ili PNG, po želji</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

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
