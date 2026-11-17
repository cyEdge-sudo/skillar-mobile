import { API_ROUTES } from "../../core/constants/app.constants";
import { apiRequest } from "../../core/api/api-client";
import type { LearningEnrollment, LearningEnrollmentPage } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseEnrollment(value: unknown): LearningEnrollment {
  if (
    !isRecord(value) ||
    typeof value.enrollmentId !== "string" ||
    typeof value.roadmapId !== "string" ||
    typeof value.title !== "string" ||
    typeof value.status !== "string" ||
    typeof value.progressPercent !== "number" ||
    (value.startedAt !== null && typeof value.startedAt !== "string") ||
    (value.lastActivityAt !== null && typeof value.lastActivityAt !== "string")
  ) {
    throw new Error("The server returned an invalid learning enrollment.");
  }

  return {
    enrollmentId: value.enrollmentId,
    roadmapId: value.roadmapId,
    title: value.title,
    status: value.status,
    progressPercent: Math.min(100, Math.max(0, value.progressPercent)),
    startedAt: value.startedAt,
    lastActivityAt: value.lastActivityAt,
  };
}

function parseEnrollmentPage(value: unknown): { items: LearningEnrollment[] } {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("The server returned an invalid enrollment list.");
  }

  return { items: value.items.map(parseEnrollment) };
}

export const learningService = {
  async listEnrollments(cursor: string | null = null, signal?: AbortSignal): Promise<LearningEnrollmentPage> {
    const params = ["limit=20"];
    if (cursor) params.push("cursor=" + encodeURIComponent(cursor));

    const response = await apiRequest(
      API_ROUTES.user.enrollments + "?" + params.join("&"),
      parseEnrollmentPage,
      { signal },
    );

    return {
      items: response.data.items,
      nextCursor: response.meta.pagination?.nextCursor ?? null,
      hasMore: response.meta.pagination?.hasMore ?? false,
    };
  },
};
