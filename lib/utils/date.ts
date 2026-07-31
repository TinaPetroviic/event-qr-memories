// Bosnian/Serbian (Latin) date formatting helpers. Always call these on the
// server and pass the resulting string down as a prop, so client and server
// renders never disagree (avoids hydration mismatches from locale APIs).

const WEEKDAYS = [
  "nedjelja",
  "ponedjeljak",
  "utorak",
  "srijeda",
  "četvrtak",
  "petak",
  "subota",
];

const MONTHS = [
  "januara",
  "februara",
  "marta",
  "aprila",
  "maja",
  "juna",
  "jula",
  "avgusta",
  "septembra",
  "oktobra",
  "novembra",
  "decembra",
];

/**
 * Formats an ISO date (YYYY-MM-DD) as e.g. "subota, 12. septembra 2026.".
 * Implemented without Intl to guarantee identical output on server and
 * client regardless of the runtime's ICU data / default locale.
 */
export function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;

  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = WEEKDAYS[date.getUTCDay()];
  const monthName = MONTHS[month - 1];

  return `${weekday}, ${day}. ${monthName} ${year}.`;
}

/** Formats an ISO date as a short numeric form, e.g. "12.09.2026." */
export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}.${pad(month)}.${year}.`;
}

/**
 * Formats a full ISO timestamp (e.g. a `created_at` value) as e.g.
 * "31. jula 2026.". Implemented without Intl for the same reason as
 * `formatEventDate` - relying on `toLocaleDateString` with a "bs-BA"
 * locale produces a broken/generic fallback on runtimes that lack that
 * locale's ICU data (observed as garbage like "2026 M07 31").
 */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}. ${monthName} ${year}.`;
}
