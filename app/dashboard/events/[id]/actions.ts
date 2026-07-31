"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, slugify } from "@/lib/utils/slug";
import { isQrDesignKey, type QrDesignKey } from "@/lib/qrDesigns";

export type SettingsFormState = {
  error?: string;
  success?: boolean;
};

export type QrDesignActionState = {
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

  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const welcomeMessage = String(formData.get("welcomeMessage") ?? "").trim();
  const galleryPublic = formData.get("galleryPublic") === "on";

  if (!title || !eventDate) {
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
      title,
      event_date: eventDate,
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

// Separate, single-purpose action for the QR card theme so switching a
// design (from the live QR card on the Pregled tab) can save immediately,
// without going through the full settings form/validation above.
export async function updateQrDesign(
  eventId: string,
  design: QrDesignKey
): Promise<QrDesignActionState> {
  const { supabase, user } = await requireOwner();

  if (!isQrDesignKey(design)) {
    return { error: "Odabrani dizajn QR kartice nije ispravan." };
  }

  const { error } = await supabase
    .from("events")
    .update({ qr_design: design })
    .eq("id", eventId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: "Došlo je do greške prilikom spremanja dizajna." };
  }

  revalidatePath(`/dashboard/events/${eventId}`);
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
