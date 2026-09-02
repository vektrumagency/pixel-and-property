/**
 * Pragmatic phone check: at least one digit, only digits/spaces/+()-. as
 * separators, 7-20 characters total. Accepts PT numbers (with or without a
 * leading 0), +351/other country codes, and common spacing/dash styles
 * without pinning to one country's numbering plan.
 */
export const PHONE_PATTERN = "^(?=.*\\d)[+]?[0-9\\(\\)\\-.\\s]{7,20}$";

const PHONE_REGEX = new RegExp(PHONE_PATTERN);

/** Phone is an optional field across the lead forms, so an empty value is valid. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === "" || PHONE_REGEX.test(trimmed);
}
