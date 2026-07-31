import Link from "next/link";
import { LogOutIcon } from "@/components/icons";

export function DashboardNav({ email }: { email: string }) {
  const initial = email.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-gold-400/20 bg-cream-50/80 shadow-sm shadow-gold-600/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="font-display text-xl text-ink-900">
          EventPix
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-gold-400/20 bg-white/60 p-1">
          <span
            title={email}
            aria-label={email}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 font-display text-xs text-gold-600"
          >
            {initial}
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Odjava"
              aria-label="Odjava"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition hover:bg-gold-500/15 hover:text-gold-600"
            >
              <LogOutIcon className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
