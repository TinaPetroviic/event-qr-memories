"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthFormState } from "./actions";
import { DecorativeGlow } from "@/components/DecorativeGlow";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

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
              &ldquo;Najljepši trenuci se pamte u malim uspomenama - hvala što ih čuvate zauvijek.&rdquo;
            </p>
            <p className="divider-flourish mt-6 justify-start text-xs font-medium uppercase tracking-[0.2em] text-cream-100/70">
              <span>Dobrodošli natrag</span>
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
            <h1 className="font-display text-3xl text-ink-900">Dobrodošli natrag</h1>
            <p className="mt-2 text-sm text-ink-700">Prijavite se kako biste upravljali svojim događajima.</p>
          </div>

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
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
            )}

            <button type="submit" disabled={pending} className="btn-primary w-full">
              {pending ? "Prijava u tijeku..." : "Prijavite se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-700">
            Nemate račun?{" "}
            <Link href="/signup" className="font-medium text-gold-600 hover:underline">
              Registrirajte se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
