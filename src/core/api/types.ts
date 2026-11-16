export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  authenticated?: boolean;
  headers?: Record<string, string>;
  idempotencyKey?: string;
  signal?: AbortSignal;
  retryAuth?: boolean;
}

export type DataParser<TData> = (value: unknown) => TData;

export interface ResponseMeta {
  requestId: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiEnvelope<TData> {
  data: TData;
  meta: ResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  code: string;
  message: string;
}

export interface CursorPage<TItem> {
  items: TItem[];
  pagination: PaginationMeta;
}
