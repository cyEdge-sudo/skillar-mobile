/**
 * Type guard for plain JSON-like objects received from external sources.
 * Keep runtime payloads as unknown until their fields are validated.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
