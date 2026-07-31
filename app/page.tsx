import Link from "next/link";

const STEPS = [
  {
    title: "Kreirajte događaj",
    text: "Registrujte se i unesite imena, datum vjenčanja i prilagođeni link za goste.",
  },
  {
    title: "Podijelite QR kod",
    text: "Isprintajte QR kod ili podijelite link na stolovima, pozivnicama ili tabli dobrodošlice.",
  },
  {
    title: "Sakupite uspomene",
    text: "Gosti fotografišu i dodaju fotografije direktno u vašu zajedničku galeriju - bez instalacije.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-20 text-center sm:py-28">
        <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
          <span>Digitalna knjiga uspomena</span>
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-ink-900 sm:text-6xl">
          Capture the Love
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-700">
          Neka vaši gosti podijele svoje najljepše trenutke s vašeg vjenčanja - jednim skeniranjem QR koda,
          bez preuzimanja aplikacije.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-gold-500 px-8 py-3.5 font-medium text-white shadow-lg shadow-gold-600/30 transition hover:bg-gold-600"
          >
            Kreirajte svoj događaj
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gold-500/50 px-8 py-3.5 font-medium text-gold-600 transition hover:bg-gold-500 hover:text-white"
          >
            Prijava
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <h2 className="text-center font-display text-3xl text-ink-900">Kako funkcioniše?</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-3xl border border-gold-400/30 bg-white/70 p-6 text-center shadow-sm shadow-gold-600/5"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 font-display text-lg text-white">
                {i + 1}
              </div>
              <h3 className="font-display text-xl text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl text-ink-900">Sve što vam je potrebno za jedan dan</h2>
          <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {[
              "Vlastiti QR kod i link za svaki događaj",
              "Galerija fotografija s mogućnošću javnog ili privatnog pregleda",
              "Jednostavno upravljanje iz vašeg admin panela",
              "Bez instalacije aplikacije za goste",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-700">
                <span className="mt-1 text-gold-500">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h2 className="font-display text-3xl text-ink-900">Spremni da počnete sakupljati uspomene?</h2>
        <div className="mt-8">
          <Link
            href="/signup"
            className="rounded-full bg-gold-500 px-8 py-3.5 font-medium text-white shadow-lg shadow-gold-600/30 transition hover:bg-gold-600"
          >
            Kreirajte besplatan račun
          </Link>
        </div>
      </section>

      <footer className="border-t border-gold-400/20 px-4 py-8 text-center text-sm text-ink-700">
        © {new Date().getFullYear()} Capture the Love
      </footer>
    </main>
  );
}
