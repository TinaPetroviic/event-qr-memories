import Link from "next/link";

export function DashboardNav({ email }: { email: string }) {
  const initial = email.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-gold-400/20 bg-cream-50/80 shadow-sm shadow-gold-600/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="font-display text-xl text-ink-900">
          Capture the Love
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-sm text-ink-700 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/15 font-display text-xs text-gold-600">
              {initial}
            </span>
            {email}
          </span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn-outline px-4 py-1.5 text-sm">
              Odjava
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
