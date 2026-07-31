import Link from "next/link";

export function DashboardNav({ email }: { email: string }) {
  const initial = email.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-ink-900 shadow-sm shadow-ink-900/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="font-display text-xl text-cream-50">
          EventPix
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden max-w-[180px] items-center gap-2 text-sm text-cream-100/80 sm:flex md:max-w-xs" title={email}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-display text-xs text-gold-300">
              {initial}
            </span>
            <span className="truncate">{email}</span>
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-1.5 text-sm font-semibold text-cream-50 transition hover:border-gold-400/60 hover:text-gold-300"
            >
              Odjava
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
