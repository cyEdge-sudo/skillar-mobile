import type { ApiRequestOptions } from "./request-types";

export type { ApiRequestOptions } from "./request-types";
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

export type { ApiRequestOptions };
