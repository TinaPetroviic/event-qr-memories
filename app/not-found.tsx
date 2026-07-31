import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">404</p>
      <h1 className="mt-4 font-display text-4xl text-ink-900">Stranica nije pronađena</h1>
      <p className="mt-3 max-w-md text-ink-700">
        Provjerite da li je link ispravan, ili se vratite na početnu stranicu.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gold-500 px-6 py-2.5 font-medium text-white shadow-md shadow-gold-600/30 transition hover:bg-gold-600"
      >
        Nazad na početnu
      </Link>
    </main>
  );
}
