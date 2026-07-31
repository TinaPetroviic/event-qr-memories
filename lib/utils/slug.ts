// Diacritic transliteration map for Bosnian/Serbian/Croatian Latin script,
// used so generated slugs stay readable ASCII (e.g. "Djurdjevic").
const DIACRITIC_MAP: Record<string, string> = {
  "č": "c", // c
  "ć": "c", // c
  "š": "s", // s
  "ž": "z", // z
  "đ": "dj", // d
  "Č": "C",
  "Ć": "C",
  "Š": "S",
  "Ž": "Z",
  "Đ": "Dj",
};

function transliterate(input: string): string {
  return input
    .split("")
    .map((char) => DIACRITIC_MAP[char] ?? char)
    .join("");
}

// Matches Unicode combining diacritical marks (U+0300 - U+036F), left over
// after NFKD normalization decomposes accented Latin letters.
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Turns arbitrary text into a URL-friendly, lowercase, hyphenated slug.
 * Handles Bosnian/Serbian/Croatian diacritics explicitly, then strips any
 * remaining non [a-z0-9-] characters (also covers generic Unicode accents
 * via NFKD normalization as a fallback).
 */
export function slugify(input: string): string {
  const transliterated = transliterate(input);

  return transliterated
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Builds a suggested event slug from the event title, e.g.
 * "Nina & Marko" -> "nina-marko", "Rođendan Amele" -> "rodjendan-amele".
 */
export function suggestEventSlug(title: string): string {
  const base = slugify(title);
  return base.replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-") || "nas-dogadjaj";
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length >= 3 && slug.length <= 80;
}
