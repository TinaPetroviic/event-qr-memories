"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupFormState = {
  error?: string;
  success?: boolean;
  hasSession?: boolean;
};

export async function signup(_prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { error: "Molimo unesite e-mail i zaporku." };
  }

  if (password.length < 6) {
    return { error: "Zaporka mora imati najmanje 6 znakova." };
  }

  if (password !== confirmPassword) {
    return { error: "Zaporke se ne podudaraju." };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Ovaj e-mail je već registriran. Pokušajte se prijaviti." };
    }
    return { error: "Registracija nije uspjela. Pokušajte ponovo." };
  }

  // If email confirmation is required, there will be no session yet.
  return { success: true, hasSession: Boolean(data.session) };
}
