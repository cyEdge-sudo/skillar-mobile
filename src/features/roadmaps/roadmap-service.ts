import { API_ROUTES, HTTP_METHODS } from "../../core/constants/app.constants";
import { apiRequest } from "../../core/api/api-client";
import type {
  RoadmapCatalogData,
  RoadmapCatalogPage,
  RoadmapEnrollment,
  RoadmapListFilters,
  RoadmapSummary,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRoadmapSummary(value: unknown): RoadmapSummary {
  if (!isRecord(value)) {
    throw new Error("The server returned an invalid roadmap.");
  }

  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.totalHours !== "number" ||
    typeof value.language !== "string" ||
    !Array.isArray(value.skillAreas) ||
    !value.skillAreas.every((item): item is string => typeof item === "string") ||
    !Array.isArray(value.keywords) ||
    !value.keywords.every((item): item is string => typeof item === "string")
  ) {
    throw new Error("The server returned an invalid roadmap.");
  }

  return {
    id: value.id,
    title: value.title,
    description: typeof value.description === "string" ? value.description : null,
    level: typeof value.level === "string" ? value.level : null,
    totalHours: value.totalHours,
    estimatedWeeks:
      typeof value.estimatedWeeks === "number" ? value.estimatedWeeks : null,
    language: value.language,
    skillAreas: value.skillAreas,
    keywords: value.keywords,
    thumbnailUrl:
      typeof value.thumbnailUrl === "string" ? value.thumbnailUrl : null,
  };
}

function parseRoadmapCatalog(value: unknown): RoadmapCatalogData {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("The server returned an invalid roadmap list.");
  }

  return {
    items: value.items.map(parseRoadmapSummary),
  };
}

function parseEnrollment(value: unknown): RoadmapEnrollment {
  if (
    !isRecord(value) ||
    typeof value.enrollmentId !== "number" ||
    typeof value.roadmapId !== "string" ||
    typeof value.status !== "string" ||
    typeof value.enrolledAt !== "string"
  ) {
    throw new Error("The server returned an invalid enrollment response.");
  }

  return {
    enrollmentId: value.enrollmentId,
    roadmapId: value.roadmapId,
    status: value.status,
    enrolledAt: value.enrolledAt,
  };
}

function buildRoadmapQuery(filters: RoadmapListFilters): string {
  const params: string[] = [];
  const limit = filters.limit ?? 20;

  params.push("limit=" + encodeURIComponent(String(limit)));

  if (filters.cursor) {
    params.push("cursor=" + encodeURIComponent(filters.cursor));
  }
  if (filters.query?.trim()) {
    params.push("q=" + encodeURIComponent(filters.query.trim()));
  }
  if (filters.level) {
    params.push("level=" + encodeURIComponent(filters.level));
  }

  return API_ROUTES.roadmaps.collection + "?" + params.join("&");
}

export const roadmapService = {
  async list(filters: RoadmapListFilters = {}): Promise<RoadmapCatalogPage> {
    const response = await apiRequest(
      buildRoadmapQuery(filters),
      parseRoadmapCatalog,
    );

    const pagination = response.meta.pagination;
    return {
      items: response.data.items,
      nextCursor: pagination?.nextCursor ?? null,
      hasMore: pagination?.hasMore ?? false,
    };
  },

  async enroll(roadmapId: string): Promise<RoadmapEnrollment> {
    const idempotencyKey =
      "mobile-enroll-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 12);

    const response = await apiRequest(
      API_ROUTES.roadmaps.enroll(roadmapId),
      parseEnrollment,
      {
        method: HTTP_METHODS.POST,
        body: {},
        idempotencyKey,
      },
    );

    return response.data;
  },
};
