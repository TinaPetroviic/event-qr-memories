"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthFormState } from "./actions";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-gold-400/30 bg-white/70 p-8 shadow-xl shadow-gold-600/10 backdrop-blur-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-2xl text-ink-900">
            Capture the Love
          </Link>
          <h1 className="mt-4 font-display text-3xl text-ink-900">Dobrodošli nazad</h1>
          <p className="mt-2 text-sm text-ink-700">Prijavite se kako biste upravljali svojim vjenčanjem.</p>
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
              className="w-full rounded-xl border border-gold-400/40 bg-cream-50 px-4 py-2.5 text-ink-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
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
              className="w-full rounded-xl border border-gold-400/40 bg-cream-50 px-4 py-2.5 text-ink-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gold-500 px-6 py-3 font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600 disabled:opacity-60"
          >
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
    </main>
  );
}
