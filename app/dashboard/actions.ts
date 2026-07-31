"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, slugify } from "@/lib/utils/slug";

export type CreateEventState = {
  error?: string;
};

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

  if (!title || !eventDate) {
    return { error: "Molimo popunite sva obavezna polja." };
  }

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
    })
    .select("id")
    .single();

  if (error || !created) {
    return { error: "Došlo je do greške prilikom kreiranja događaja. Pokušajte ponovo." };
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
