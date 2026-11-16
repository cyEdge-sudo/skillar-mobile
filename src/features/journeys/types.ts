export interface JourneySummary {
  enrollmentId: number;
  status: string;
  enrolledAt: string;
  dueAt: string | null;
  completedAt: string | null;
  currentStagePosition: number;
  journey: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    durationDays: number | null;
  };
  progress: {
    percent: number;
    totalStages: number;
    completedStages: number;
    totalActivities: number;
    completedActivities: number;
  };
  nextActivity: {
    id: number;
    type: string;
    title: string;
    stagePosition: number;
  } | null;
}

export interface JourneyPage {
  items: JourneySummary[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface JourneyAssessmentQuestion {
  questionId: string;
  type: string;
  question: string;
  options: Array<{ optionId: string; text: string }>;
}

export interface JourneyActivityMetadata {
  taskBody?: string;
  contentUrl?: string | null;
  duration?: number | null;
  fileName?: string | null;
  available?: boolean;
  roadmapId?: string | null;
  acknowledgementText?: string;
  questions?: JourneyAssessmentQuestion[];
  totalQuestions?: number;
  passingScore?: number | null;
}

export interface JourneyActivity {
  id: number;
  type: string;
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  metadata: JourneyActivityMetadata;
  progress: {
    status: string;
    completedAt: string | null;
    score: number | null;
  };
  attempts: Array<{
    id: number;
    attemptNumber: number;
    scorePercent: number;
    isPassed: boolean;
    submittedAt: string;
  }>;
}

export interface JourneyStage {
  id: number;
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  unlockAfterDays: number | null;
  progress: {
    isUnlocked: boolean;
    isCompleted: boolean;
    unlockedAt: string | null;
    completedAt: string | null;
  };
  activities: JourneyActivity[];
}

export interface JourneyDetail {
  enrollmentId: number;
  status: string;
  enrolledAt: string;
  dueAt: string | null;
  completedAt: string | null;
  currentStagePosition: number;
  journey: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    durationDays: number | null;
    stages: JourneyStage[];
  };
  progress: {
    percent: number;
    totalStages: number;
    completedStages: number;
    totalActivities: number;
    completedActivities: number;
  };
}

export interface JourneyActivityCompletion {
  activityId: number;
  status: string;
  completedAt: string | null;
  stageCompleted: boolean;
  nextStagePosition: number | null;
}
