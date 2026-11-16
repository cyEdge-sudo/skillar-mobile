import { API_ROUTES, HTTP_METHODS } from "../../core/constants/app.constants";
import { apiRequest } from "../../core/api/api-client";
import type {
  JourneyActivity,
  JourneyActivityCompletion,
  JourneyDetail,
  JourneyPage,
  JourneyProgress,
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

function requiredId(value: unknown, field: string): number {
  const id = requiredNumber(value, field);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("The server returned an invalid journey identifier: " + field);
  }
  return id;
}

function requiredCount(value: unknown, field: string): number {
  const count = requiredNumber(value, field);
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("The server returned an invalid journey count: " + field);
  }
  return count;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("The server returned an invalid journey field: " + field);
  }
  return value;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function parseProgress(value: unknown): JourneyProgress {
  if (!isRecord(value)) {
    throw new Error("The server returned invalid journey progress.");
  }

  const percent = requiredNumber(value.percent, "progress.percent");
  if (percent < 0 || percent > 100) {
    throw new Error("The server returned an invalid journey progress percentage.");
  }

  return {
    percent,
    totalStages: requiredCount(value.totalStages, "progress.totalStages"),
    completedStages: requiredCount(value.completedStages, "progress.completedStages"),
    totalActivities: requiredCount(value.totalActivities, "progress.totalActivities"),
    completedActivities: requiredCount(value.completedActivities, "progress.completedActivities"),
  };
}

function parseJourneySummary(value: unknown): JourneySummary {
  if (!isRecord(value) || !isRecord(value.journey)) {
    throw new Error("The server returned an invalid journey.");
  }

  const nextActivity = isRecord(value.nextActivity)
    ? {
        id: requiredId(value.nextActivity.id, "nextActivity.id"),
        type: requiredString(value.nextActivity.type, "nextActivity.type"),
        title: requiredString(value.nextActivity.title, "nextActivity.title"),
        stagePosition: requiredCount(
          value.nextActivity.stagePosition,
          "nextActivity.stagePosition",
        ),
      }
    : null;

  return {
    enrollmentId: requiredId(value.enrollmentId, "enrollmentId"),
    status: requiredString(value.status, "status"),
    enrolledAt: requiredString(value.enrolledAt, "enrolledAt"),
    dueAt: nullableString(value.dueAt),
    completedAt: nullableString(value.completedAt),
    currentStagePosition: requiredCount(
      value.currentStagePosition,
      "currentStagePosition",
    ),
    journey: {
      id: requiredId(value.journey.id, "journey.id"),
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
  const totalQuestions = nullableNumber(metadata.totalQuestions);
  const questions = Array.isArray(metadata.questions)
    ? metadata.questions.filter(isRecord).map((question, index) => ({
        questionId:
          typeof question.questionId === "string" && question.questionId.length > 0
            ? question.questionId
            : "question-" + String(index + 1),
        type: typeof question.type === "string" ? question.type : "MCQ",
        question: typeof question.question === "string" ? question.question : "",
        options: Array.isArray(question.options)
          ? question.options.filter(isRecord).map((option, optionIndex) => ({
              optionId:
                typeof option.optionId === "string" && option.optionId.length > 0
                  ? option.optionId
                  : String(optionIndex + 1),
              text: typeof option.text === "string" ? option.text : "",
            }))
          : [],
      }))
    : undefined;

  const attempts = Array.isArray(value.attempts)
    ? value.attempts.filter(isRecord).map((attempt) => ({
        id: requiredId(attempt.id, "attempt.id"),
        attemptNumber: requiredCount(attempt.attemptNumber, "attempt.attemptNumber"),
        scorePercent: requiredNumber(attempt.scorePercent, "attempt.scorePercent"),
        isPassed: attempt.isPassed === true,
        submittedAt: requiredString(attempt.submittedAt, "attempt.submittedAt"),
      }))
    : [];

  return {
    id: requiredId(value.id, "activity.id"),
    type: requiredString(value.type, "activity.type"),
    title: requiredString(value.title, "activity.title"),
    description: nullableString(value.description),
    position: requiredCount(value.position, "activity.position"),
    isRequired: value.isRequired === true,
    metadata: {
      ...(typeof metadata.taskBody === "string"
        ? { taskBody: metadata.taskBody }
        : {}),
      contentUrl: nullableString(metadata.contentUrl),
      duration: nullableNumber(metadata.duration),
      fileName: nullableString(metadata.fileName),
      available: metadata.available === true,
      roadmapId: nullableString(metadata.roadmapId),
      ...(typeof metadata.acknowledgementText === "string"
        ? { acknowledgementText: metadata.acknowledgementText }
        : {}),
      ...(questions ? { questions } : {}),
      ...(totalQuestions !== null ? { totalQuestions } : {}),
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
    id: requiredId(value.id, "stage.id"),
    title: requiredString(value.title, "stage.title"),
    description: nullableString(value.description),
    position: requiredCount(value.position, "stage.position"),
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
    enrollmentId: requiredId(value.enrollmentId, "enrollmentId"),
    status: requiredString(value.status, "status"),
    enrolledAt: requiredString(value.enrolledAt, "enrolledAt"),
    dueAt: nullableString(value.dueAt),
    completedAt: nullableString(value.completedAt),
    currentStagePosition: requiredCount(
      value.currentStagePosition,
      "currentStagePosition",
    ),
    journey: {
      id: requiredId(value.journey.id, "journey.id"),
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
    activityId: requiredId(value.activityId, "activityId"),
    status: requiredString(value.status, "status"),
    completedAt: nullableString(value.completedAt),
    stageCompleted: value.stageCompleted === true,
    nextStagePosition:
      value.nextStagePosition === null || value.nextStagePosition === undefined
        ? null
        : requiredCount(value.nextStagePosition, "nextStagePosition"),
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
