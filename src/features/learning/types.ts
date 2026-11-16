export interface LearningEnrollment {
  enrollmentId: number;
  roadmapId: string;
  title: string;
  status: string;
  progressPercent: number;
  startedAt: string | null;
  lastActivityAt: string | null;
}

export interface LearningEnrollmentPage {
  items: LearningEnrollment[];
  nextCursor: string | null;
  hasMore: boolean;
}
