import { z } from "zod";

// Date validation schema
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// Core date formatting function
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

// Get today's date in YYYY-MM-DD format
export function getToday(): string {
  const now = new Date();
  return formatDate(now);
}

// Parse string to Date object (assumes YYYY-MM-DD format)
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Get display date format (e.g., for UI)
export function getDisplayDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

// Get previous N days from a given date
export function getPreviousDays(date: Date | string, count: number): string[] {
  const startDate = typeof date === "string" ? parseDate(date) : date;
  const dates: string[] = [];

  for (let i = 0; i < count; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() - i);
    dates.push(formatDate(currentDate));
  }

  return dates;
}

// Compare two dates (returns true if they're the same day)
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = formatDate(date1);
  const d2 = formatDate(date2);
  return d1 === d2;
}
