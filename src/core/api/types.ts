export interface ResponseMeta {
  requestId: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: ResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  code: string;
  message: string;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta?: {
    requestId?: string;
  };
}

export interface CursorPage<T> {
  items: T[];
  pagination: PaginationMeta;
}
