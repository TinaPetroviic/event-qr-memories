"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, slugify } from "@/lib/utils/slug";

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function updateEventSettings(
  eventId: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const { supabase, user } = await requireOwner();

  const brideName = String(formData.get("brideName") ?? "").trim();
  const groomName = String(formData.get("groomName") ?? "").trim();
  const weddingDate = String(formData.get("weddingDate") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const welcomeMessage = String(formData.get("welcomeMessage") ?? "").trim();
  const galleryPublic = formData.get("galleryPublic") === "on";

  if (!brideName || !groomName || !weddingDate) {
    return { error: "Molimo popunite sva obavezna polja." };
  }

  const slug = slugify(rawSlug);
  if (!isValidSlug(slug)) {
    return { error: "Link mora sadržavati barem 3 znaka (slova, brojevi i crtice)." };
  }

  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .neq("id", eventId)
    .maybeSingle();

  if (existing) {
    return { error: "Ovaj link je već zauzet. Odaberite drugi." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      bride_name: brideName,
      groom_name: groomName,
      wedding_date: weddingDate,
      slug,
      welcome_message: welcomeMessage,
      gallery_public: galleryPublic,
    })
    .eq("id", eventId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: "Došlo je do greške prilikom spremanja postavki." };
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePhoto(eventId: string, photoId: string, storagePath: string) {
  const { supabase } = await requireOwner();

  await supabase.storage.from("photos").remove([storagePath]);
  await supabase.from("photos").delete().eq("id", photoId).eq("event_id", eventId);

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function deleteEvent(eventId: string) {
  const { supabase, user } = await requireOwner();

  await supabase.from("events").delete().eq("id", eventId).eq("owner_id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
