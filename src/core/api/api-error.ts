import type { ApiErrorDetail, ApiErrorPayload } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly requestId?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code: string;
      details?: ApiErrorDetail[];
      requestId?: string;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details ?? [];
    this.requestId = options.requestId;
  }

  static fromResponse(status: number, payload: unknown): ApiError {
    const candidate = payload as Partial<ApiErrorPayload> | null;
    const error = candidate?.error;

    return new ApiError(
      error?.message ?? "The request could not be completed.",
      {
        status,
        code: error?.code ?? "HTTP_ERROR",
        details: error?.details,
        requestId: candidate?.meta?.requestId,
      },
    );
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "Unable to connect. Check your internet connection and try again.";
    }
    if (error.status >= 500) {
      return "The service is temporarily unavailable. Please try again.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
