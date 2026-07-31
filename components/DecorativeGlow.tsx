// A single restrained ambient glow used behind a handful of hero/marketing
// sections (landing hero + dark CTA, auth side panel, guest hero, 404).
// Deliberately just one soft, low-opacity shape tucked into a corner rather
// than several bright overlapping blobs spanning the whole section - the
// goal is a faint warmth in the background, not a decorative centerpiece.
export function DecorativeGlow({ tone = "light" }: { tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-400/10 blur-[110px]" />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-300/15 blur-[110px]" />
    </div>
  );
}
