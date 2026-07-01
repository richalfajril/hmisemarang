// Runnable check: `npx tsx src/shared/lib/agenda.check.ts`
import assert from "node:assert";
import {
  getAgendaStatus,
  getAgendaBadge,
  getCountdownLabel,
  formatAgendaDate,
} from "./agenda";

const now = new Date("2026-06-15T10:00:00");

// status
assert.equal(getAgendaStatus(new Date("2026-06-20"), null, now), "upcoming");
assert.equal(getAgendaStatus(new Date("2026-06-15T20:00"), null, now), "today");
assert.equal(getAgendaStatus(new Date("2026-06-10"), null, now), "done");
// rentang multi-hari mencakup hari ini → today
assert.equal(
  getAgendaStatus(new Date("2026-06-14"), new Date("2026-06-17"), now),
  "today"
);

// badge
assert.equal(getAgendaBadge("today"), "Hari Ini");
assert.equal(getAgendaBadge("upcoming"), "Akan Datang");
assert.equal(getAgendaBadge("done"), "Selesai");

// countdown
assert.equal(getCountdownLabel(new Date("2026-06-16"), now), "Besok");
assert.equal(getCountdownLabel(new Date("2026-06-18"), now), "3 Hari Lagi");
assert.equal(getCountdownLabel(new Date("2026-06-15"), now), null);
assert.equal(getCountdownLabel(new Date("2026-06-10"), now), null);

// format
assert.equal(formatAgendaDate(new Date("2026-02-05"), null), "05 Feb 2026");
assert.equal(
  formatAgendaDate(new Date("2026-12-01"), new Date("2026-12-07")),
  "01 - 07 Des 2026"
);
assert.equal(
  formatAgendaDate(new Date("2026-12-28"), new Date("2027-01-03")),
  "28 Des - 03 Jan 2027"
);

console.log("agenda.ts checks passed ✓");
