import Link from "next/link";
import { DecorativeGlow } from "@/components/DecorativeGlow";
import { HeroIllustration } from "@/components/HeroIllustration";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { CameraIcon, CheckIcon, Icon, MicrophoneIcon, PlusIcon, type IconName } from "@/components/icons";

const CATEGORIES: { label: string; icon: IconName }[] = [
  { label: "Vjenčanja", icon: "rings" },
  { label: "Rođendani", icon: "cake" },
  { label: "Godišnjice", icon: "champagne" },
  { label: "Krštenja", icon: "dove" },
  { label: "Maturske večeri", icon: "graduationCap" },
  { label: "Korporativni eventi", icon: "building" },
];

const STEPS: { title: string; text: string; icon: IconName }[] = [
  {
    title: "Kreirajte događaj",
    text: "Registrirajte se i unesite naziv događaja, datum i prilagođeni link za goste - za vjenčanje, rođendan, godišnjicu tvrtke ili bilo koju drugu proslavu.",
    icon: "mail",
  },
  {
    title: "Podijelite QR kod",
    text: "Isprintajte QR kod u jednom od dizajna ili podijelite link na stolovima, pozivnicama ili tabli dobrodošlice.",
    icon: "link",
  },
  {
    title: "Sakupite uspomene",
    text: "Gosti fotografiraju, snimaju video ili ostave glasovnu poruku direktno u vašoj zajedničkoj galeriji.",
    icon: "heart",
  },
];

const FEATURES: { title: string; text: string; icon: IconName }[] = [
  {
    title: "Fotografije i video",
    text: "Gosti dodaju fotografije i video snimke jednim dodirom, direktno iz preglednika.",
    icon: "camera",
  },
  {
    title: "Glasovne poruke",
    text: "Poseban dodir - gosti mogu snimiti i ostaviti glasovnu čestitku ili poruku.",
    icon: "microphone",
  },
  {
    title: "4 dizajna QR kartice",
    text: "Odaberite Klasik, Modernu, Romantiku ili Rustik izgled koji odgovara vašem događaju.",
    icon: "palette",
  },
  {
    title: "Javna ili privatna galerija",
    text: "Sami odlučujete mogu li gosti pregledati sve uspomene ili su vidljive samo vama.",
    icon: "lock",
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
      <SiteHeader />
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 px-4 pb-14 pt-20 sm:pb-20 sm:pt-28">
        <DecorativeGlow />
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p
              className="animate-fade-up text-xs font-medium uppercase tracking-[0.3em] text-gold-600"
              style={{ animationDelay: "0ms" }}
            >
              Digitalna galerija uspomena za svaki događaj
            </p>
            <h1
              className="animate-fade-up mt-6 max-w-xl font-display text-5xl leading-tight text-ink-900 sm:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              EventPix
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-ink-700"
              style={{ animationDelay: "260ms" }}
            >
              Gosti dijele fotografije, video i glasovne poruke s vašeg vjenčanja, rođendana ili bilo koje
              druge proslave - jednim skeniranjem QR koda, bez preuzimanja aplikacije.
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "400ms" }}
            >
              <Link href="/signup" className="btn-primary px-8 py-3.5">
                Kreirajte svoj događaj
              </Link>
              <Link href="/login" className="btn-outline px-8 py-3.5">
                Prijava
              </Link>
            </div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: "320ms" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section className="bg-cream-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
              Za svaku vrstu proslave
            </p>
          </Reveal>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {CATEGORIES.map((category, index) => (
              <Reveal
                key={category.label}
                delay={Math.min(index * 60, 300)}
                className="card-surface-interactive flex shrink-0 items-center gap-2.5 px-5 py-3 sm:shrink"
              >
                <Icon name={category.icon} className="h-5 w-5 shrink-0 text-gold-600" aria-hidden />
                <span className="whitespace-nowrap text-sm font-medium text-ink-900">
                  {category.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="kako-funkcionira" className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-20">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            Jednostavno u tri koraka
          </p>
          <h2 className="mt-4 font-display text-3xl text-ink-900">Kako funkcionira?</h2>
        </Reveal>
        <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent sm:block"
          />
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 130}
              className="card-surface-interactive relative flex flex-col items-center p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-md shadow-gold-600/30">
                <Icon name={step.icon} className="h-6 w-6 text-white" aria-hidden />
              </div>
              <h3 className="font-display text-xl text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="znacajke" className="scroll-mt-8 bg-cream-100 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
              Sve na jednom mjestu
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink-900">
              Sve što vam je potrebno za bilo koju proslavu
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <Reveal
                key={feature.title}
                animation="scale-in"
                delay={Math.min(index * 90, 270)}
                className="flex items-start gap-4 rounded-2xl border border-gold-400/20 bg-white/60 p-5 shadow-sm shadow-gold-600/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-50 shadow-inner">
                  <Icon name={feature.icon} className="h-5 w-5 text-gold-600" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-ink-700">{feature.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden className="w-full overflow-hidden bg-cream-100">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block h-14 w-full sm:h-20">
          <path
            d="M0,32 C240,90 480,90 720,50 C960,10 1200,10 1440,55 L1440,100 L0,100 Z"
            fill="#2e2419"
          />
        </svg>
      </div>

      <section className="relative overflow-hidden bg-ink-900 px-4 py-20 text-cream-50">
        <DecorativeGlow tone="dark" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal animation="slide-in-left" className="text-center lg:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
              Nula trenja za goste
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
                "Bez računa ili lozinke za goste",
                "Radi na svakom telefonu s kamerom i internetom",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-cream-50/90">
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/90 text-ink-900"
                  >
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal animation="slide-in-right" delay={120} className="flex justify-center">
            <div
              aria-hidden
              className="relative flex h-[320px] w-[170px] flex-col rounded-[2.25rem] border-4 border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02] p-2 shadow-2xl shadow-black/40 sm:h-[360px] sm:w-[190px]"
            >
              {/* Side buttons, for a bit of phone-hardware realism. */}
              <span className="absolute -right-[3px] top-16 h-9 w-[3px] rounded-full bg-white/15" />
              <span className="absolute -left-[3px] top-12 h-5 w-[3px] rounded-full bg-white/15" />
              <span className="absolute -left-[3px] top-20 h-8 w-[3px] rounded-full bg-white/15" />

              <div className="mx-auto mb-1.5 h-1.5 w-10 shrink-0 rounded-full bg-white/25" />

              <div className="flex flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                {/* Browser address bar - a real webpage, not an installed app. */}
                <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                  <span className="flex-1 truncate rounded-full bg-white/10 px-2 py-1 text-center text-[7px] tracking-wide text-white/50">
                    qr-uspomene.app/e/nina-i-marko
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-3 text-center">
                  <CameraIcon className="h-8 w-8 text-white" aria-hidden />
                  <span className="rounded-full bg-gold-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-black/20">
                    Dodaj fotografiju
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">ili</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-4 py-1.5 text-xs text-white/70">
                    <MicrophoneIcon className="h-3.5 w-3.5" aria-hidden /> Snimi poruku
                  </span>

                  <div className="mt-2 flex gap-1.5" aria-hidden>
                    {["bg-gold-400/50", "bg-blush-300/50", "bg-white/25", "bg-gold-300/40"].map((tone, i) => (
                      <span key={i} className={`h-6 w-6 rounded-md ${tone}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-8 px-4 py-20">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            Česta pitanja
          </p>
          <h2 className="mt-4 font-display text-3xl text-ink-900">Što je EventPix?</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-ink-700">
            EventPix je jednostavan način da sakupite fotografije, video snimke i glasovne poruke
            gostiju s vašeg vjenčanja, rođendana, godišnjice ili bilo koje druge proslave - sve na jednom
            mjestu, bez potrebe da gosti instaliraju bilo šta.
          </p>
        </Reveal>
        <div className="mt-10 space-y-4">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.q} delay={Math.min(index * 70, 280)}>
              <details className="card-surface group px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl font-display text-lg text-ink-900 outline-none transition-colors hover:text-gold-600 focus-visible:ring-2 focus-visible:ring-gold-400/50">
                  {faq.q}
                  <span
                    aria-hidden
                    className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-100 text-gold-500 transition-transform duration-300 group-open:rotate-45"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </span>
                </summary>
                <p className="group-open:animate-fade-up mt-3 text-sm text-ink-700" style={{ animationDuration: "0.35s" }}>
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20 text-center">
        <Reveal animation="scale-in" className="mx-auto max-w-2xl rounded-[2.5rem] border border-gold-400/30 bg-gradient-to-br from-white/80 to-cream-100/80 px-6 py-14 shadow-lg shadow-gold-600/10 sm:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600">
            Počnite danas
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
        </Reveal>
      </section>

      <footer className="border-t border-gold-400/20 bg-cream-100/60 px-4 pb-10 pt-16 text-sm text-ink-700 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-xs">
            <p className="font-display text-lg text-ink-900">EventPix</p>
            <p className="mx-auto mt-3 max-w-[26ch] text-ink-700/80 sm:mx-0">
              Digitalna galerija uspomena za vjenčanja, rođendane i sve vrste proslava.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <nav aria-label="Proizvod">
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
                    Mogućnosti
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

            <nav aria-label="Račun">
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
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <p className="text-center text-xs text-ink-700/70">
            © {new Date().getFullYear()} EventPix. Sva prava pridržana.
          </p>
        </div>
      </footer>
    </main>
  );
}
