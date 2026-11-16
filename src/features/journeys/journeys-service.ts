import { API_ROUTES, HTTP_METHODS } from "../../core/constants/app.constants";
import { apiRequest } from "../../core/api/api-client";
import type {
  JourneyActivity,
  JourneyActivityCompletion,
  JourneyDetail,
  JourneyPage,
  JourneyStage,
  JourneySummary,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("The server returned an invalid journey field: " + field);
  }
  return value;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error("The server returned an invalid journey field: " + field);
  }
  return value;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseProgress(value: unknown): JourneySummary["progress"] {
  if (!isRecord(value)) {
    throw new Error("The server returned invalid journey progress.");
  }
  return {
    percent: Math.min(100, Math.max(0, requiredNumber(value.percent, "progress.percent"))),
    totalStages: requiredNumber(value.totalStages, "progress.totalStages"),
    completedStages: requiredNumber(value.completedStages, "progress.completedStages"),
    totalActivities: requiredNumber(value.totalActivities, "progress.totalActivities"),
    completedActivities: requiredNumber(value.completedActivities, "progress.completedActivities"),
  };
}

function parseJourneySummary(value: unknown): JourneySummary {
  if (!isRecord(value) || !isRecord(value.journey)) {
    throw new Error("The server returned an invalid journey.");
  }
  const nextActivity = isRecord(value.nextActivity)
    ? {
        id: requiredNumber(value.nextActivity.id, "nextActivity.id"),
        type: requiredString(value.nextActivity.type, "nextActivity.type"),
        title: requiredString(value.nextActivity.title, "nextActivity.title"),
        stagePosition: requiredNumber(value.nextActivity.stagePosition, "nextActivity.stagePosition"),
      }
    : null;

  return {
    enrollmentId: requiredNumber(value.enrollmentId, "enrollmentId"),
    status: requiredString(value.status, "status"),
    enrolledAt: requiredString(value.enrolledAt, "enrolledAt"),
    dueAt: nullableString(value.dueAt),
    completedAt: nullableString(value.completedAt),
    currentStagePosition: requiredNumber(value.currentStagePosition, "currentStagePosition"),
    journey: {
      id: requiredNumber(value.journey.id, "journey.id"),
      title: requiredString(value.journey.title, "journey.title"),
      description: nullableString(value.journey.description),
      type: requiredString(value.journey.type, "journey.type"),
      durationDays: nullableNumber(value.journey.durationDays),
    },
    progress: parseProgress(value.progress),
    nextActivity,
  };
}

function parseJourneyPage(value: unknown): { items: JourneySummary[] } {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("The server returned an invalid journey list.");
  }
  return { items: value.items.map(parseJourneySummary) };
}

function parseActivity(value: unknown): JourneyActivity {
  if (!isRecord(value) || !isRecord(value.progress)) {
    throw new Error("The server returned an invalid journey activity.");
  }
  const metadata = isRecord(value.metadata) ? value.metadata : {};
  const questions = Array.isArray(metadata.questions)
    ? metadata.questions.filter(isRecord).map((question) => ({
        questionId: typeof question.questionId === "string" ? question.questionId : "",
        type: typeof question.type === "string" ? question.type : "MCQ",
        question: typeof question.question === "string" ? question.question : "",
        options: Array.isArray(question.options)
          ? question.options.filter(isRecord).map((option) => ({
              optionId: typeof option.optionId === "string" ? option.optionId : "",
              text: typeof option.text === "string" ? option.text : "",
            }))
          : [],
      }))
    : undefined;

  const attempts = Array.isArray(value.attempts)
    ? value.attempts.filter(isRecord).map((attempt) => ({
        id: requiredNumber(attempt.id, "attempt.id"),
        attemptNumber: requiredNumber(attempt.attemptNumber, "attempt.attemptNumber"),
        scorePercent: requiredNumber(attempt.scorePercent, "attempt.scorePercent"),
        isPassed: attempt.isPassed === true,
        submittedAt: requiredString(attempt.submittedAt, "attempt.submittedAt"),
      }))
    : [];

  return {
    id: requiredNumber(value.id, "activity.id"),
    type: requiredString(value.type, "activity.type"),
    title: requiredString(value.title, "activity.title"),
    description: nullableString(value.description),
    position: requiredNumber(value.position, "activity.position"),
    isRequired: value.isRequired === true,
    metadata: {
      taskBody: typeof metadata.taskBody === "string" ? metadata.taskBody : undefined,
      contentUrl: nullableString(metadata.contentUrl),
      duration: nullableNumber(metadata.duration),
      fileName: nullableString(metadata.fileName),
      available: metadata.available === true,
      roadmapId: nullableString(metadata.roadmapId),
      acknowledgementText:
        typeof metadata.acknowledgementText === "string" ? metadata.acknowledgementText : undefined,
      questions,
      totalQuestions: nullableNumber(metadata.totalQuestions) ?? undefined,
      passingScore: nullableNumber(metadata.passingScore),
    },
    progress: {
      status: requiredString(value.progress.status, "activity.progress.status"),
      completedAt: nullableString(value.progress.completedAt),
      score: nullableNumber(value.progress.score),
    },
    attempts,
  };
}

function parseStage(value: unknown): JourneyStage {
  if (!isRecord(value) || !isRecord(value.progress) || !Array.isArray(value.activities)) {
    throw new Error("The server returned an invalid journey stage.");
  }
  return {
    id: requiredNumber(value.id, "stage.id"),
    title: requiredString(value.title, "stage.title"),
    description: nullableString(value.description),
    position: requiredNumber(value.position, "stage.position"),
    isRequired: value.isRequired === true,
    unlockAfterDays: nullableNumber(value.unlockAfterDays),
    progress: {
      isUnlocked: value.progress.isUnlocked === true,
      isCompleted: value.progress.isCompleted === true,
      unlockedAt: nullableString(value.progress.unlockedAt),
      completedAt: nullableString(value.progress.completedAt),
    },
    activities: value.activities.map(parseActivity),
  };
}

function parseJourneyDetail(value: unknown): JourneyDetail {
  if (!isRecord(value) || !isRecord(value.journey) || !Array.isArray(value.journey.stages)) {
    throw new Error("The server returned invalid journey details.");
  }
  return {
    enrollmentId: requiredNumber(value.enrollmentId, "enrollmentId"),
    status: requiredString(value.status, "status"),
    enrolledAt: requiredString(value.enrolledAt, "enrolledAt"),
    dueAt: nullableString(value.dueAt),
    completedAt: nullableString(value.completedAt),
    currentStagePosition: requiredNumber(value.currentStagePosition, "currentStagePosition"),
    journey: {
      id: requiredNumber(value.journey.id, "journey.id"),
      title: requiredString(value.journey.title, "journey.title"),
      description: nullableString(value.journey.description),
      type: requiredString(value.journey.type, "journey.type"),
      durationDays: nullableNumber(value.journey.durationDays),
      stages: value.journey.stages.map(parseStage),
    },
    progress: parseProgress(value.progress),
  };
}

function parseCompletion(value: unknown): JourneyActivityCompletion {
  if (!isRecord(value)) {
    throw new Error("The server returned an invalid activity completion response.");
  }
  return {
    activityId: requiredNumber(value.activityId, "activityId"),
    status: requiredString(value.status, "status"),
    completedAt: nullableString(value.completedAt),
    stageCompleted: value.stageCompleted === true,
    nextStagePosition: nullableNumber(value.nextStagePosition),
  };
}

export const journeysService = {
  async list(cursor: string | null = null): Promise<JourneyPage> {
    const params = ["limit=20"];
    if (cursor) params.push("cursor=" + encodeURIComponent(cursor));
    const response = await apiRequest(
      API_ROUTES.journeys.collection + "?" + params.join("&"),
      parseJourneyPage,
    );
    return {
      items: response.data.items,
      nextCursor: response.meta.pagination?.nextCursor ?? null,
      hasMore: response.meta.pagination?.hasMore ?? false,
    };
  },

  async getDetail(enrollmentId: number): Promise<JourneyDetail> {
    const response = await apiRequest(
      API_ROUTES.journeys.detail(enrollmentId),
      parseJourneyDetail,
    );
    return response.data;
  },

  async completeActivity(
    enrollmentId: number,
    activityId: number,
  ): Promise<JourneyActivityCompletion> {
    const response = await apiRequest(
      API_ROUTES.journeys.completeActivity(enrollmentId, activityId),
      parseCompletion,
      { method: HTTP_METHODS.POST },
    );
    return response.data;
  },
};
