export type RoadmapLevel = "beginner" | "intermediate" | "advanced";

export interface RoadmapSummary {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  totalHours: number;
  estimatedWeeks: number | null;
  language: string;
  skillAreas: string[];
  keywords: string[];
  thumbnailUrl: string | null;
}

export interface RoadmapStepSummary {
  id: string;
  title: string;
  sequence: number;
  description: string | null;
  estimatedMinutes: number;
  contentStatus: "ready" | "pending" | "unknown";
  progress?: {
    status: "not_started" | "in_progress" | "completed";
    progressPercent: number;
    updatedAt?: string;
  } | null;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  sequence: number;
  description: string | null;
  estimatedHours: number | null;
  steps: RoadmapStepSummary[];
}

export interface RoadmapDetail extends RoadmapSummary {
  milestones: RoadmapMilestone[];
}

export interface RoadmapCatalogData {
  items: RoadmapSummary[];
}

export interface RoadmapCatalogPage {
  items: RoadmapSummary[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface RoadmapListFilters {
  query?: string;
  level?: RoadmapLevel | null;
  cursor?: string | null;
  limit?: number;
}

export interface RoadmapEnrollment {
  enrollmentId: string;
  roadmapId: string;
  status: string;
  enrolledAt: string;
}

export interface RoadmapDetailRouteParams {
  roadmapId: string;
  enrollmentId?: string;
}
