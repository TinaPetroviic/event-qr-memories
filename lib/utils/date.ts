// Numeric date formatting helpers (day.month.year - no weekday or month
// names), so date display never depends on locale/ICU data or wording that
// differs between regional variants of the language.

/** Formats an ISO date (YYYY-MM-DD) as e.g. "12.09.2026." */
export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}.${pad(month)}.${year}.`;
}

/**
 * Formats a full ISO timestamp (e.g. a `created_at` value) the same way,
 * e.g. "31.07.2026.".
 */
export function formatTimestampShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}.`;
}
