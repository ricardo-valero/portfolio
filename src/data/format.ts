/** "2024-09" → "09.2024", matching the PDF's date style. */
export const formatYearMonth = (ym: string): string => {
  const [year, month] = ym.split("-")
  return `${month}.${year}`
}

/** Absent end = ongoing role. Arrow rather than a dash, by author preference. */
export const formatRange = (start: string, end?: string): string =>
  `${formatYearMonth(start)} → ${end ? formatYearMonth(end) : "Present"}`
