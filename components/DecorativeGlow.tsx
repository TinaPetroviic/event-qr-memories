// Soft, blurred accent shapes used behind hero/marketing sections across the
// app (landing hero, guest upload page, auth screens, 404). Kept as a single
// shared component since the same treatment is reused in several places -
// this way the look stays consistent and any tweak only happens in one spot.
export function DecorativeGlow({ tone = "light" }: { tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-cream-100/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-300/25 blur-3xl" />
      <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-blush-300/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-gold-200/25 blur-3xl" />
    </div>
  );
}
