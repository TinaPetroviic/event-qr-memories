import Link from "next/link";

export function DashboardNav({ email }: { email: string }) {
  return (
    <header className="border-b border-gold-400/20 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="font-display text-xl text-ink-900">
          Capture the Love
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink-700 sm:inline">{email}</span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-gold-500/50 px-4 py-1.5 text-sm font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white"
            >
              Odjava
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
