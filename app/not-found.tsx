import Link from "next/link";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        <DecorativeGlow />
        <div className="animate-fade-up relative">
          <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            <span>404</span>
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-900">Stranica nije pronađena</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-700">
            Provjerite je li link ispravan, ili se vratite na početnu stranicu.
          </p>
          <Link href="/" className="btn-primary mt-8">
            Natrag na početnu
          </Link>
        </div>
      </main>
    </>
  );
}
