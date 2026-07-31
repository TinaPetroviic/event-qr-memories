"use client";

import { useTransition } from "react";
import { deleteEvent } from "@/app/dashboard/events/[id]/actions";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm("Jeste li sigurni da želite trajno izbrisati ovaj događaj i sve fotografije?")) {
      return;
    }
    // deleteEvent redirects to /dashboard on success.
    startTransition(() => {
      deleteEvent(eventId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60"
    >
      {isPending ? "Brisanje..." : "Izbriši događaj"}
    </button>
  );
}
