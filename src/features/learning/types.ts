export type StepProgressStatus = "not_started" | "in_progress" | "completed";

export interface LearningEnrollment {
  enrollmentId: string;
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

export interface StepProgress {
  status: StepProgressStatus;
  progressPercent: number;
  updatedAt: string;
}

export interface EnrolledRoadmapStep {
  id: string;
  title: string;
  sequence: number;
  description: string | null;
  estimatedMinutes: number;
  contentStatus: "ready" | "pending" | "unknown";
  progress: StepProgress | null;
}

export interface EnrolledRoadmapMilestone {
  id: string;
  title: string;
  sequence: number;
  description: string | null;
  estimatedHours: number | null;
  steps: EnrolledRoadmapStep[];
}

export interface EnrollmentDetail {
  enrollmentId: string;
  roadmapId: string;
  status: string;
  startedAt: string | null;
  lastActivityAt: string | null;
  roadmap: {
    id: string;
    title: string;
    description: string | null;
    language: string;
    skillAreas: string[];
    milestones: EnrolledRoadmapMilestone[];
  };
}

export interface StepVideo {
  provider: string;
  videoId: string;
  url: string;
}

export interface StepContent {
  stepId: string;
  title: string;
  contentMarkdown: string | null;
  video: StepVideo | null;
}

export interface AssessmentOption {
  optionId: string;
  text: string;
}

export interface AssessmentQuestion {
  questionId: string;
  type: string;
  question: string;
  options: AssessmentOption[] | null;
}

export interface StepAssessment {
  items: AssessmentQuestion[];
  totalQuestions: number;
}

export interface StepProgressUpdate {
  status: StepProgressStatus;
  progressPercent: number;
  updatedAt: string;
}
