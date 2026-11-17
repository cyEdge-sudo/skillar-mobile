import { FORM_VALIDATION } from '../constants/app.constants';

/**
 * Normalize email input before validation or API submission.
 */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return FORM_VALIDATION.emailPattern.test(value);
}

/**
 * Validate a calendar date in YYYY-MM-DD format without accepting overflow
 * dates such as 2023-02-29 or 2024-04-31.
 */
export function isValidDateOnly(value: string): boolean {
  if (!FORM_VALIDATION.dateOnlyPattern.test(value)) {
    return false;
  }

  const [yearPart, monthPart, dayPart] = value.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  const candidate = new Date(0);

  candidate.setUTCFullYear(year, month - 1, day);
  candidate.setUTCHours(0, 0, 0, 0);

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}
