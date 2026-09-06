export type CalendarKind = "objective" | "task";
export type CalendarPriority = "low" | "medium" | "high";

export type CalendarItem = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  kind: CalendarKind;
  completed: boolean;
  priority?: CalendarPriority;
};

export type CalendarMonth = { year: number; month: number };

const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function daysInMonth(year: number, month: number) {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function normalizeDateKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = dateKeyPattern.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 2000 || year > 2100 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function parseCalendarMonth(
  yearValue: unknown,
  monthValue: unknown,
  fallback: CalendarMonth
): CalendarMonth {
  const year = typeof yearValue === "string" && /^\d{4}$/.test(yearValue)
    ? Number(yearValue)
    : NaN;
  const month = typeof monthValue === "string" && /^(?:[1-9]|1[0-2])$/.test(monthValue)
    ? Number(monthValue)
    : NaN;
  return year >= 2000 && year <= 2100 && month >= 1 && month <= 12
    ? { year, month }
    : fallback;
}

export function moveCalendarMonth(value: CalendarMonth, delta: -1 | 1): CalendarMonth {
  if (delta === 1 && value.month === 12) return { year: value.year + 1, month: 1 };
  if (delta === -1 && value.month === 1) return { year: value.year - 1, month: 12 };
  return { year: value.year, month: value.month + delta };
}

export function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const cells: Array<{ date: string | null; day: number | null }> = Array.from(
    { length: mondayOffset },
    () => ({ date: null, day: null })
  );
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    cells.push({
      day,
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
  return cells;
}

export function groupCalendarItems(items: readonly CalendarItem[]) {
  const grouped: Record<string, CalendarItem[]> = {};
  for (const item of items) {
    const date = normalizeDateKey(item.date);
    if (!date) continue;
    grouped[date] ??= [];
    grouped[date].push(item);
  }
  return grouped;
}

export function isCalendarItemOverdue(item: CalendarItem, today: string) {
  const date = normalizeDateKey(item.date);
  const normalizedToday = normalizeDateKey(today);
  return Boolean(date && normalizedToday && !item.completed && date < normalizedToday);
}
