// Pure helpers untuk status & format tanggal agenda (dipakai homepage carousel
// dan halaman agenda nanti). Status/countdown dihitung dari tanggal, bukan dari
// enum workflow Agenda.

export type AgendaStatus = "today" | "upcoming" | "done";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Status berdasar perbandingan hari (inklusif start..end). */
export function getAgendaStatus(
  start: Date,
  end: Date | null,
  now: Date = new Date()
): AgendaStatus {
  const today = startOfDay(now);
  const startDay = startOfDay(start);
  const endDay = startOfDay(end ?? start);
  if (today < startDay) return "upcoming";
  if (today > endDay) return "done";
  return "today";
}

export function getAgendaBadge(status: AgendaStatus): string {
  return status === "today"
    ? "Hari Ini"
    : status === "upcoming"
      ? "Akan Datang"
      : "Selesai";
}

/** "Besok" | "N Hari Lagi" | null (null bila bukan upcoming). */
export function getCountdownLabel(
  start: Date,
  now: Date = new Date()
): string | null {
  const days = Math.round((startOfDay(start) - startOfDay(now)) / DAY_MS);
  if (days <= 0) return null;
  if (days === 1) return "Besok";
  return `${days} Hari Lagi`;
}

const dayFmt = new Intl.DateTimeFormat("id-ID", { day: "2-digit" });
const monthFmt = new Intl.DateTimeFormat("id-ID", { month: "short" });
const fullFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * "05 Feb 2026" (satu hari) atau "01 - 07 Des 2026" (rentang). Bila beda
 * bulan/tahun: "28 Des - 03 Jan 2027".
 */
export function formatAgendaDate(start: Date, end: Date | null): string {
  if (!end || startOfDay(end) === startOfDay(start)) {
    return fullFmt.format(start);
  }
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${dayFmt.format(start)} - ${fullFmt.format(end)}`;
  }
  return `${dayFmt.format(start)} ${monthFmt.format(start)} - ${fullFmt.format(end)}`;
}
