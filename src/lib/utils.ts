import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(user: User): string {
  if (!user) return "";

  // If we have first and last name, use their first characters
  if (user.first_name && user.last_name) {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(
      0
    )}`.toUpperCase();
  }

  // If we only have one name, use its first two characters
  if (user.first_name) {
    return user.first_name.slice(0, 2).toUpperCase();
  }

  if (user.last_name) {
    return user.last_name.slice(0, 2).toUpperCase();
  }

  // Fallback: use first two characters of email
  return user.email.slice(0, 2).toUpperCase();
}

export function formatToCurrency(
  value: number = 0,
  currency: string = "USD",
  locale = "en-NG"
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(Number(value.toFixed(2)));
  } catch (error) {
    console.log("Error formatting amount:", error);
    return "0";
  }
}

export function filterFalsyValues<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    // Handle nested objects (recursively)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const filteredNestedObject = filterFalsyValues(value);
      if (Object.keys(filteredNestedObject).length > 0) {
        acc[key as keyof T] = filteredNestedObject as T[keyof T];
      }
      return acc;
    }

    // Handle arrays: filter out empty arrays, and clean object items inside arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // skip empty arrays
        return acc;
      }
      const processed = value
        .map((item) =>
          item && typeof item === "object" && !Array.isArray(item)
            ? filterFalsyValues(item)
            : item
        )
        .filter((item) => {
          if (item == null) return false;
          if (typeof item === "object") {
            if (Array.isArray(item)) return item.length > 0;
            return Object.keys(item).length > 0;
          }
          return true;
        });

      if (processed.length > 0) {
        acc[key as keyof T] = processed as T[keyof T];
      }
      return acc;
    }

    // Handle strings: filter out empty or whitespace-only strings
    if (typeof value === "string") {
      if (value.trim() !== "") {
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }

    // Add truthy primitives, booleans, or numeric zero
    if (value || typeof value === "boolean" || value === 0) {
      acc[key as keyof T] = value;
    }

    return acc;
  }, {} as Partial<T>);
}

import {
  isToday,
  isSameDay,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  isEqual,
  format,
} from "date-fns";
import { User } from "@/hooks/use-fetch-user";

function toDate(d?: Date | string | number | null) {
  if (!d && d !== 0) return null;
  return d instanceof Date ? d : new Date(d as string | number);
}

/**
 * Describe a date range with human-friendly labels:
 * - "all" when either date is missing
 * - "today" / "yesterday" when start === end and matches those
 * - "last 7 days" when the range is exactly 7 days
 * - "last month" when it matches the full previous calendar month
 * - "last N months" for full-month ranges (N >= 2)
 * - "last 30 days" for ~30-day ranges
 * - fallback: "MMM dd, yyyy - MMM dd, yyyy"
 */
export function describeDateRange(
  startInput?: Date | string | number | null,
  endInput?: Date | string | number | null
): string {
  const startRaw = toDate(startInput);
  const endRaw = toDate(endInput);

  if (!startRaw || !endRaw) return "all";

  // Ensure start <= end
  let start = startRaw;
  let end = endRaw;
  if (start.getTime() > end.getTime()) {
    [start, end] = [end, start];
  }

  // same day checks
  if (isSameDay(start, end)) {
    if (isToday(start)) return "today";
    const yesterday = subDays(new Date(), 1);
    if (isSameDay(start, yesterday)) return "yesterday";
    return format(start, "MMM dd, yyyy");
  }

  const daysDiff = differenceInCalendarDays(end, start);
  // last 7 days (exactly 7 days apart)
  if (daysDiff === 7) return "last 7 days";

  // this month: from beginning of this month until today
  const today = new Date();
  const startOfThisMonth = startOfMonth(today);
  if (isSameDay(start, startOfThisMonth) && isSameDay(end, today)) {
    return "this month";
  }

  // ~30 day checks
  if (daysDiff >= 28 && daysDiff <= 31) {
    // exact full previous calendar month?
    const prevMonth = subMonths(end, 1);
    if (
      isEqual(startOfMonth(prevMonth), startOfMonth(start)) &&
      isEqual(endOfMonth(prevMonth), endOfMonth(end))
    ) {
      return "last month";
    }
    return "last 30 days";
  }

  // full-month spans -> last N months
  const monthsDiff = differenceInCalendarMonths(
    // align to month starts for comparison
    startOfMonth(end),
    startOfMonth(start)
  );
  if (monthsDiff >= 1) {
    // Check if range covers whole months (start is startOfMonth and end is endOfMonth of previous month)
    // e.g. start = startOfMonth(subMonths(end, N)), end = endOfMonth(subMonths(end, 1))
    for (let n = 1; n <= 12; n++) {
      const candidateStart = startOfMonth(subMonths(end, n));
      const candidateEnd = endOfMonth(subMonths(end, 1));
      if (
        isEqual(candidateStart, startOfMonth(start)) &&
        isEqual(candidateEnd, endOfMonth(end))
      ) {
        return n === 1 ? "last month" : `last ${n} months`;
      }
    }
  }

  // last N days fallback (if small range)
  if (daysDiff <= 14) return `last ${daysDiff} days`;

  // fallback range format
  return `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
}
