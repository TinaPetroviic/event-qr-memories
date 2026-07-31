import Link from "next/link";

const NAV_LINKS = [
  { href: "#kako-funkcionira", label: "Kako funkcionira" },
  { href: "#znacajke", label: "Značajke" },
  { href: "#faq", label: "Česta pitanja" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gold-400/15 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-ink-900">
          EventPix
        </Link>

        <nav aria-label="Glavni izbornik" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-gold-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink-700 transition-colors hover:text-gold-600 sm:inline"
          >
            Prijava
          </Link>
          <Link href="/signup" className="btn-primary px-5 py-2 text-sm">
            Kreirajte događaj
          </Link>
        </div>
      </div>
    </header>
  );
}
