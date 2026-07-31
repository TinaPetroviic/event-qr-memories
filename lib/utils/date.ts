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
export function formatWeddingDate(isoDate: string): string {
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
