const MONTHS_SHORT = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** "2026-06-12" → "12 June 2026" */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-09-14" → { month: "SEP", day: "14" } */
export function eventMonthDay(iso: string): { month: string; day: string } {
  const d = new Date(`${iso}T00:00:00`);
  return {
    month: MONTHS_SHORT[d.getMonth()],
    day: String(d.getDate()).padStart(2, "0"),
  };
}
