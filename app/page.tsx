import Link from "next/link";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { HeroIllustration } from "@/components/HeroIllustration";

const CATEGORIES = [
  { label: "Vjenčanja", icon: "💍" },
  { label: "Rođendani", icon: "🎂" },
  { label: "Godišnjice", icon: "🥂" },
  { label: "Krštenja", icon: "🕊️" },
  { label: "Maturske večeri", icon: "🎓" },
  { label: "Korporativni eventi", icon: "🏢" },
];

const STEPS = [
  {
    title: "Kreirajte događaj",
    text: "Registrirajte se i unesite naziv događaja, datum i prilagođeni link za goste - za vjenčanje, rođendan, godišnjicu tvrtke ili bilo koju drugu proslavu.",
    icon: "💌",
  },
  {
    title: "Podijelite QR kod",
    text: "Isprintajte QR kod u jednom od dizajna ili podijelite link na stolovima, pozivnicama ili tabli dobrodošlice.",
    icon: "🔗",
  },
  {
    title: "Sakupite uspomene",
    text: "Gosti fotografiraju, snimaju video ili ostave glasovnu poruku direktno u vašoj zajedničkoj galeriji.",
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
    text: "Poseban dodir - gosti mogu snimiti i ostaviti glasovnu čestitku ili poruku.",
    icon: "🎙️",
  },
  {
    title: "4 dizajna QR kartice",
    text: "Odaberite Klasik, Modernu, Romantiku ili Rustik izgled koji odgovara vašem događaju.",
    icon: "🎨",
  },
  {
    title: "Javna ili privatna galerija",
    text: "Sami odlučujete mogu li gosti pregledati sve uspomene ili su vidljive samo vama.",
    icon: "🔒",
  },
];

const FAQS = [
  {
    q: "Moraju li gosti instalirati aplikaciju?",
    a: "Ne. Gost samo skenira QR kod ili otvori link u svom pretraživaču - stranica se odmah otvori i može dodati fotografiju, video ili glasovnu poruku. Nije potrebna nikakva instalacija niti kreiranje računa.",
  },
  {
    q: "Mogu li imati više događaja na jednom računu?",
    a: "Da. Iz svog računa možete kreirati onoliko događaja koliko želite - svaki dobiva svoj jedinstveni link i QR kod, potpuno odvojen od ostalih.",
  },
  {
    q: "Mogu li izbrisati fotografije ili cijeli događaj?",
    a: "Da. Iz admin panela u svakom trenutku možete izbrisati pojedinačnu fotografiju, video ili glasovnu poruku, kao i u potpunosti izbrisati događaj zajedno sa svim sadržajem.",
  },
  {
    q: "Koliko fotografija, videa ili poruka gosti mogu dodati?",
    a: "Nema ograničenja - gosti mogu dodati onoliko fotografija, video zapisa i glasovnih poruka koliko žele, jednu za drugom, sve dok traje događaj.",
  },
  {
    q: "Mora li galerija biti javna?",
    a: "Ne, vi birate. Galerija može biti javna pa je svi gosti mogu pregledati, ili privatna pa su sve uspomene vidljive samo vama u admin panelu.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 py-20 sm:py-28">
        <DecorativeGlow />
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p
              className="divider-flourish animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600 lg:justify-start"
              style={{ animationDelay: "0ms" }}
            >
              <span>Digitalna knjiga uspomena za svaki događaj</span>
            </p>
            <h1
              className="animate-fade-up mt-6 max-w-xl font-display text-5xl leading-tight text-ink-900 sm:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              QR Uspomene
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-ink-700"
              style={{ animationDelay: "160ms" }}
            >
              Neka vaši gosti podijele svoje najljepše trenutke s vašeg vjenčanja, rođendana, godišnjice
              tvrtke ili bilo kojeg drugog događaja - jednim skeniranjem QR koda, bez preuzimanja aplikacije.
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
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section className="border-y border-gold-400/15 bg-cream-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            Za svaku vrstu proslave
          </p>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {CATEGORIES.map((category) => (
              <div
                key={category.label}
                className="card-surface-interactive flex shrink-0 items-center gap-2.5 px-5 py-3 sm:shrink"
              >
                <span className="text-xl" aria-hidden>
                  {category.icon}
                </span>
                <span className="whitespace-nowrap text-sm font-medium text-ink-900">
                  {category.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kako-funkcionira" className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-20">
        <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
          <span>Jednostavno u tri koraka</span>
        </p>
        <h2 className="mt-4 text-center font-display text-3xl text-ink-900">Kako funkcionira?</h2>
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

      <section id="znacajke" className="scroll-mt-8 bg-cream-100 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
              <span>Sve na jednom mjestu</span>
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink-900">
              Sve što vam je potrebno za bilo koju proslavu
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

      <section className="relative overflow-hidden bg-ink-900 px-4 py-20 text-cream-50">
        <DecorativeGlow tone="dark" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
              <span>Nula trenja za goste</span>
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              Bez aplikacije. Bez registracije. Samo skenirajte i pošaljite.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-cream-100/80 lg:mx-0">
              Vaši gosti ne moraju ništa preuzimati niti otvarati račun. Skeniraju QR kod telefonom,
              stranica se otvori u pretraživaču i za par sekundi njihova uspomena je u vašoj galeriji.
            </p>
            <ul className="mx-auto mt-6 max-w-md space-y-3 text-left lg:mx-0">
              {[
                "Bez preuzimanja aplikacije",
                "Bez računa ili zaporke za goste",
                "Radi na svakom telefonu s kamerom i internetom",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-cream-50/90">
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/90 text-xs text-ink-900"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <div
              aria-hidden
              className="flex h-[300px] w-[160px] flex-col rounded-[2rem] border-4 border-white/15 bg-white/5 p-2.5 shadow-2xl shadow-black/30 sm:h-[340px] sm:w-[180px]"
            >
              <div className="mx-auto mb-2 h-1.5 w-10 shrink-0 rounded-full bg-white/25" />
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-b from-white/10 to-white/[0.03] px-3 text-center">
                <span className="text-3xl">📷</span>
                <span className="rounded-full bg-gold-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-black/20">
                  Dodaj fotografiju
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">ili</span>
                <span className="rounded-full border border-white/25 px-4 py-1.5 text-xs text-white/70">
                  🎙️ Snimi poruku
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-8 px-4 py-20">
        <p className="divider-flourish text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
          <span>Česta pitanja</span>
        </p>
        <h2 className="mt-4 text-center font-display text-3xl text-ink-900">Što je QR Uspomene?</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-ink-700">
          QR Uspomene je jednostavan način da sakupite fotografije, video snimke i glasovne poruke
          gostiju s vašeg vjenčanja, rođendana, godišnjice ili bilo koje druge proslave - sve na jednom
          mjestu, bez potrebe da gosti instaliraju bilo šta.
        </p>
        <div className="mt-10 space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="card-surface group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl font-display text-lg text-ink-900 outline-none transition-colors hover:text-gold-600 focus-visible:ring-2 focus-visible:ring-gold-400/50">
                {faq.q}
                <span
                  aria-hidden
                  className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-100 text-gold-500 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-700">{faq.a}</p>
            </details>
          ))}
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
            Kreirajte besplatan račun za nekoliko minuta i imajte svoj QR kod spreman prije velikog dana -
            bilo da slavite vjenčanje, rođendan, godišnjicu tvrtke ili nešto sasvim svoje.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="btn-primary px-8 py-3.5">
              Kreirajte besplatan račun
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gold-400/20 bg-cream-100/60 px-4 pb-10 pt-16 text-sm text-ink-700">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-8">
          <div className="col-span-2 text-center sm:col-span-1 sm:text-left">
            <p className="divider-flourish justify-center font-display text-lg text-ink-900 sm:justify-start">
              <span>QR Uspomene</span>
            </p>
            <p className="mx-auto mt-3 max-w-[26ch] text-ink-700/80 sm:mx-0">
              Digitalna knjiga uspomena za vjenčanja, rođendane i sve vrste proslava.
            </p>
          </div>

          <nav aria-label="Proizvod" className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Proizvod</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#kako-funkcionira"
                  className="rounded transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                >
                  Kako funkcionira
                </a>
              </li>
              <li>
                <a
                  href="#znacajke"
                  className="rounded transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                >
                  Značajke
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="rounded transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                >
                  Česta pitanja
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Račun" className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Račun</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/signup"
                  className="rounded transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                >
                  Registracija
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="rounded transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                >
                  Prijava
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-12 max-w-5xl border-t border-gold-400/15 pt-6">
          <p className="text-center text-xs text-ink-700/70">
            © {new Date().getFullYear()} QR Uspomene. Sva prava pridržana.
          </p>
        </div>
      </footer>
    </main>
  );
}
