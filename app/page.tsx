import Link from "next/link";
import { DecorativeGlow } from "@/components/DecorativeGlow";

const STEPS = [
  {
    title: "Kreirajte događaj",
    text: "Registrujte se i unesite imena, datum vjenčanja i prilagođeni link za goste.",
    icon: "💌",
  },
  {
    title: "Podijelite QR kod",
    text: "Isprintajte QR kod u jednom od dizajna ili podijelite link na stolovima, pozivnicama ili tabli dobrodošlice.",
    icon: "🔗",
  },
  {
    title: "Sakupite uspomene",
    text: "Gosti fotografišu, snimaju video ili ostave glasovnu poruku direktno u vašoj zajedničkoj galeriji.",
    icon: "🤍",
  },
];

const FEATURES = [
  {
    title: "Fotografije i video",
    text: "Gosti dodaju fotografije i video snimke jednim dodirom, direktno iz preglednika.",
    icon: "📷",
  },
  {
    title: "Glasovne poruke",
    text: "Poseban dodir - gosti mogu snimiti i ostaviti glasovnu čestitku mladencima.",
    icon: "🎙️",
  },
  {
    title: "4 dizajna QR kartice",
    text: "Odaberite Klasik, Modernu, Romantiku ili Rustik izgled koji odgovara vašem vjenčanju.",
    icon: "🎨",
  },
  {
    title: "Javna ili privatna galerija",
    text: "Sami odlučujete da li gosti mogu pregledati sve uspomene ili su vidljive samo vama.",
    icon: "🔒",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-20 sm:py-28">
        <DecorativeGlow />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <p
            className="divider-flourish animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600"
            style={{ animationDelay: "0ms" }}
          >
            <span>Digitalna knjiga uspomena</span>
          </p>
          <h1
            className="animate-fade-up mt-6 max-w-3xl font-display text-5xl leading-tight text-ink-900 sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Capture the Love
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg text-ink-700"
            style={{ animationDelay: "160ms" }}
          >
            Neka vaši gosti podijele svoje najljepše trenutke s vašeg vjenčanja - jednim skeniranjem QR
            koda, bez preuzimanja aplikacije.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Link href="/signup" className="btn-primary px-8 py-3.5">
              Kreirajte svoj događaj
            </Link>
            <Link href="/login" className="btn-outline px-8 py-3.5">
              Prijava
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
          <span>Jednostavno u tri koraka</span>
        </p>
        <h2 className="mt-4 text-center font-display text-3xl text-ink-900">Kako funkcioniše?</h2>
        <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent sm:block"
          />
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="card-surface-interactive relative flex flex-col items-center p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-2xl shadow-md shadow-gold-600/30">
                {step.icon}
              </div>
              <h3 className="font-display text-xl text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
              <span>Sve na jednom mjestu</span>
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink-900">
              Sve što vam je potrebno za jedan poseban dan
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-2xl border border-gold-400/20 bg-white/60 p-5 shadow-sm shadow-gold-600/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-50 text-xl shadow-inner">
                  {feature.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-ink-700">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-gold-400/30 bg-gradient-to-br from-white/80 to-cream-100/80 px-6 py-14 shadow-lg shadow-gold-600/10 sm:px-12">
          <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            <span>Počnite danas</span>
          </p>
          <h2 className="mt-4 font-display text-3xl text-ink-900">
            Spremni da počnete sakupljati uspomene?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-700">
            Kreirajte besplatan račun za nekoliko minuta i imajte svoj QR kod spreman prije velikog dana.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="btn-primary px-8 py-3.5">
              Kreirajte besplatan račun
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gold-400/20 px-4 py-8 text-center text-sm text-ink-700">
        © {new Date().getFullYear()} Capture the Love
      </footer>
    </main>
  );
}
