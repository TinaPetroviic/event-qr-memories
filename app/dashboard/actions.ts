"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, slugify } from "@/lib/utils/slug";
import { isEventTypeKey } from "@/lib/eventTypes";

export type CreateEventState = {
  error?: string;
};

// Uploads an optional cover image to the "photos" bucket under a
// covers/<event_id>/ prefix (kept separate from guest-submitted media, and
// writable only by the event's owner - see supabase/migrations/0005). Returns
// the storage path on success, or null if the upload failed - a failure here
// should never block event creation, it just means no cover image gets set.
async function uploadCoverImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `covers/${eventId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("photos").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  return error ? null : path;
}

export async function createEvent(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const rawEventType = String(formData.get("eventType") ?? "other").trim();
  const coverImage = formData.get("coverImage");

  if (!title || !eventDate) {
    return { error: "Molimo popunite sva obavezna polja." };
  }

  if (!isEventTypeKey(rawEventType)) {
    return { error: "Odabrana vrsta događaja nije ispravna." };
  }
  const eventType = rawEventType;

  const slug = slugify(rawSlug || title);

  if (!isValidSlug(slug)) {
    return { error: "Link mora sadržavati barem 3 znaka (slova, brojevi i crtice)." };
  }

  const { data: existing } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();

  if (existing) {
    return { error: "Ovaj link je već zauzet. Odaberite drugi." };
  }

  const { data: created, error } = await supabase
    .from("events")
    .insert({
      owner_id: user.id,
      title,
      event_date: eventDate,
      slug,
      event_type: eventType,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { error: "Došlo je do greške prilikom kreiranja događaja. Pokušajte ponovo." };
  }

  // Cover image is fully optional - if nothing was chosen, or the upload
  // fails for any reason, the event is still created successfully with
  // cover_image_path left null.
  if (coverImage instanceof File && coverImage.size > 0 && coverImage.type.startsWith("image/")) {
    const path = await uploadCoverImage(supabase, created.id, coverImage);
    if (path) {
      await supabase.from("events").update({ cover_image_path: path }).eq("id", created.id);
    }
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/events/${created.id}`);
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("events").delete().eq("id", eventId).eq("owner_id", user.id);
  revalidatePath("/dashboard");
}
