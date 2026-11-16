import {
  API_ERROR_CODES,
  APP_MESSAGES,
} from "../constants/app.constants";
import type { ApiErrorDetail } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDetails(value: unknown): ApiErrorDetail[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): ApiErrorDetail[] => {
    if (!isRecord(item)) {
      return [];
    }

    if (typeof item.code !== "string" || typeof item.message !== "string") {
      return [];
    }

    const detail: ApiErrorDetail = {
      code: item.code,
      message: item.message,
    };

    if (typeof item.field === "string") {
      detail.field = item.field;
    }

    return [detail];
  });
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly requestId: string | undefined;

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
    const root = isRecord(payload) ? payload : {};
    const error = isRecord(root.error) ? root.error : {};
    const meta = isRecord(root.meta) ? root.meta : {};

    const message =
      typeof error.message === "string"
        ? error.message
        : APP_MESSAGES.requestFailed;
    const code =
      typeof error.code === "string"
        ? error.code
        : API_ERROR_CODES.HTTP_ERROR;
    const requestId =
      typeof meta.requestId === "string" ? meta.requestId : undefined;

    return new ApiError(message, {
      status,
      code,
      details: parseDetails(error.details),
      ...(requestId ? { requestId } : {}),
    });
  }

  static network(
    code: string,
    message: string,
  ): ApiError {
    return new ApiError(message, { status: 0, code });
  }

  static invalidResponse(requestId?: string): ApiError {
    return new ApiError(APP_MESSAGES.invalidServerResponse, {
      status: 502,
      code: API_ERROR_CODES.INVALID_RESPONSE,
      ...(requestId ? { requestId } : {}),
    });
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return error.message;
    }

    if (error.status >= 500) {
      return APP_MESSAGES.serviceUnavailable;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return APP_MESSAGES.unknownError;
}
