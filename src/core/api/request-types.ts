import type { JsonValue } from "./types-base";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: JsonValue;
  authenticated?: boolean;
  headers?: Record<string, string>;
  idempotencyKey?: string;
  signal?: AbortSignal;
  retryAuth?: boolean;
}
