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
  enrollmentId: number;
  roadmapId: string;
  status: string;
  enrolledAt: string;
}
