"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { signup, type SignupFormState } from "./actions";
import { DecorativeGlow } from "@/components/DecorativeGlow";

const initialState: SignupFormState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.hasSession) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-ink-900/10 shadow-xl shadow-ink-900/10 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-10 text-cream-50 lg:flex">
          <DecorativeGlow tone="dark" />
          <Link href="/" className="relative font-display text-2xl">
            EventPix
          </Link>
          <div className="relative">
            <p className="font-display text-2xl leading-snug">
              &ldquo;Svaka fotografija je uspomena zauvijek - sakupite ih sve na jednom mjestu, za bilo koji
              događaj.&rdquo;
            </p>
            <p className="divider-flourish mt-6 justify-start text-xs font-medium uppercase tracking-[0.2em] text-cream-100/70">
              <span>Kreirajte svoj album</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="font-display text-2xl text-ink-900">
              EventPix
            </Link>
          </div>
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-3xl text-ink-900">Kreirajte račun</h1>
            <p className="mt-2 text-sm text-ink-700">
              Napravite nezaboravnu digitalnu uspomenu s fotografijama vaših gostiju, za bilo koju vrstu
              događaja.
            </p>
          </div>

          {state.success && !state.hasSession ? (
            <div className="space-y-4 text-center">
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                Registracija uspješna! Provjerite svoj e-mail kako biste potvrdili račun, a zatim se
                prijavite.
              </p>
              <Link href="/login" className="btn-primary inline-flex">
                Idi na prijavu
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-field"
                  placeholder="vas@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
                  Lozinka
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="input-field"
                  placeholder="Najmanje 6 znakova"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-ink-700">
                  Potvrdite lozinku
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="input-field"
                  placeholder="Ponovite lozinku"
                />
              </div>

              {state.error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
              )}

              <button type="submit" disabled={pending} className="btn-primary w-full">
                {pending ? "Kreiranje računa..." : "Registrirajte se"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-700">
            Već imate račun?{" "}
            <Link href="/login" className="font-medium text-gold-600 hover:underline">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
