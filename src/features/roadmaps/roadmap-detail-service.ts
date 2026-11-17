import { API_ROUTES } from '../../core/constants/app.constants';
import { apiRequest } from '../../core/api/api-client';
import type { RoadmapDetail, RoadmapMilestone, RoadmapStepSummary } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((item): item is string => typeof item === 'string')) {
    throw new Error('The server returned invalid ' + field + '.');
  }
  return value;
}

function parseStep(value: unknown): RoadmapStepSummary {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.sequence !== 'number' ||
    typeof value.estimatedMinutes !== 'number'
  ) {
    throw new Error('The server returned an invalid roadmap step.');
  }

  const contentStatus =
    value.contentStatus === 'ready' || value.contentStatus === 'pending'
      ? value.contentStatus
      : 'unknown';

  return {
    id: value.id,
    title: value.title,
    sequence: value.sequence,
    description: typeof value.description === 'string' ? value.description : null,
    estimatedMinutes: Math.max(0, value.estimatedMinutes),
    contentStatus,
  };
}

function parseMilestone(value: unknown): RoadmapMilestone {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.sequence !== 'number' ||
    !Array.isArray(value.steps)
  ) {
    throw new Error('The server returned an invalid roadmap milestone.');
  }

  return {
    id: value.id,
    title: value.title,
    sequence: value.sequence,
    description: typeof value.description === 'string' ? value.description : null,
    estimatedHours: typeof value.estimatedHours === 'number' ? value.estimatedHours : null,
    steps: value.steps.map(parseStep),
  };
}

function parseRoadmapDetail(value: unknown): RoadmapDetail {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.totalHours !== 'number' ||
    typeof value.language !== 'string' ||
    !Array.isArray(value.milestones)
  ) {
    throw new Error('The server returned an invalid roadmap detail.');
  }

  return {
    id: value.id,
    title: value.title,
    description: typeof value.description === 'string' ? value.description : null,
    level: typeof value.level === 'string' ? value.level : null,
    totalHours: value.totalHours,
    estimatedWeeks: typeof value.estimatedWeeks === 'number' ? value.estimatedWeeks : null,
    language: value.language,
    skillAreas: parseStringArray(value.skillAreas, 'roadmap skill areas'),
    keywords: parseStringArray(value.keywords, 'roadmap keywords'),
    thumbnailUrl: typeof value.thumbnailUrl === 'string' ? value.thumbnailUrl : null,
    milestones: value.milestones.map(parseMilestone),
  };
}

export const roadmapDetailService = {
  async get(roadmapId: string, signal?: AbortSignal): Promise<RoadmapDetail> {
    const response = await apiRequest(API_ROUTES.roadmaps.detail(roadmapId), parseRoadmapDetail, {
      ...(signal ? { signal } : {}),
    });
    return response.data;
  },
};
