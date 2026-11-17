import {
  API_ROUTES,
  HTTP_METHODS,
} from "../../core/constants/app.constants";
import { apiRequest } from "../../core/api/api-client";
import { parseStepContentBlocks } from "./step-content-parser";
import type {
  AssessmentQuestion,
  EnrollmentDetail,
  EnrolledRoadmapMilestone,
  EnrolledRoadmapStep,
  StepAssessment,
  StepContent,
  StepProgressStatus,
  StepProgressUpdate,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStep(value: unknown): EnrolledRoadmapStep {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.sequence !== "number" ||
    typeof value.estimatedMinutes !== "number"
  ) {
    throw new Error("The server returned an invalid learning step.");
  }

  let progress: EnrolledRoadmapStep["progress"] = null;
  if (value.progress !== null && value.progress !== undefined) {
    if (!isRecord(value.progress) || typeof value.progress.status !== "string") {
      throw new Error("The server returned invalid step progress.");
    }
    const status: StepProgressStatus =
      value.progress.status === "completed"
        ? "completed"
        : value.progress.status === "in_progress"
          ? "in_progress"
          : "not_started";
    progress = {
      status,
      progressPercent:
        typeof value.progress.progressPercent === "number"
          ? Math.min(100, Math.max(0, value.progress.progressPercent))
          : status === "completed" ? 100 : 0,
      updatedAt:
        typeof value.progress.updatedAt === "string" ? value.progress.updatedAt : "",
    };
  }

  return {
    id: value.id,
    title: value.title,
    sequence: value.sequence,
    description: typeof value.description === "string" ? value.description : null,
    estimatedMinutes: Math.max(0, value.estimatedMinutes),
    contentStatus:
      value.contentStatus === "ready" || value.contentStatus === "pending"
        ? value.contentStatus
        : "unknown",
    progress,
  };
}

function parseMilestone(value: unknown): EnrolledRoadmapMilestone {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.sequence !== "number" ||
    !Array.isArray(value.steps)
  ) {
    throw new Error("The server returned an invalid learning milestone.");
  }

  return {
    id: value.id,
    title: value.title,
    sequence: value.sequence,
    description: typeof value.description === "string" ? value.description : null,
    estimatedHours:
      typeof value.estimatedHours === "number" ? value.estimatedHours : null,
    steps: value.steps.map(parseStep),
  };
}

function parseEnrollmentDetail(value: unknown): EnrollmentDetail {
  if (
    !isRecord(value) ||
    typeof value.enrollmentId !== "string" ||
    typeof value.roadmapId !== "string" ||
    !isRecord(value.roadmap) ||
    typeof value.roadmap.id !== "string" ||
    typeof value.roadmap.title !== "string" ||
    typeof value.roadmap.language !== "string" ||
    !Array.isArray(value.roadmap.milestones) ||
    !Array.isArray(value.roadmap.skillAreas) ||
    !value.roadmap.skillAreas.every((item): item is string => typeof item === "string")
  ) {
    throw new Error("The server returned an invalid enrollment detail.");
  }

  return {
    enrollmentId: value.enrollmentId,
    roadmapId: value.roadmapId,
    status: typeof value.status === "string" ? value.status : "unknown",
    startedAt: typeof value.startedAt === "string" ? value.startedAt : null,
    lastActivityAt:
      typeof value.lastActivityAt === "string" ? value.lastActivityAt : null,
    roadmap: {
      id: value.roadmap.id,
      title: value.roadmap.title,
      description:
        typeof value.roadmap.description === "string"
          ? value.roadmap.description
          : null,
      language: value.roadmap.language,
      skillAreas: value.roadmap.skillAreas,
      milestones: value.roadmap.milestones.map(parseMilestone),
    },
  };
}

function parseStepContent(value: unknown): StepContent {
  if (!isRecord(value) || typeof value.stepId !== "string" || typeof value.title !== "string") {
    throw new Error("The server returned invalid step content.");
  }

  let video: StepContent["video"] = null;
  if (value.video !== null && value.video !== undefined) {
    if (
      !isRecord(value.video) ||
      typeof value.video.provider !== "string" ||
      typeof value.video.url !== "string" ||
      typeof value.video.videoId !== "string"
    ) {
      throw new Error("The server returned invalid video content.");
    }
    video = {
      provider: value.video.provider,
      videoId: value.video.videoId,
      url: value.video.url,
    };
  }

  return {
    stepId: value.stepId,
    title: value.title,
    contentMarkdown:
      typeof value.contentMarkdown === "string" ? value.contentMarkdown : null,
    video,
    contentBlocks: parseStepContentBlocks(value.StepContent ?? value.stepContents ?? value.contentBlocks),
  };
}

function parseAssessmentQuestion(value: unknown): AssessmentQuestion {
  if (
    !isRecord(value) ||
    typeof value.questionId !== "string" ||
    typeof value.type !== "string" ||
    typeof value.question !== "string"
  ) {
    throw new Error("The server returned an invalid assessment question.");
  }

  let options: AssessmentQuestion["options"] = null;
  if (Array.isArray(value.options)) {
    options = value.options.map((option) => {
      if (
        !isRecord(option) ||
        typeof option.optionId !== "string" ||
        typeof option.text !== "string"
      ) {
        throw new Error("The server returned invalid assessment options.");
      }
      return { optionId: option.optionId, text: option.text };
    });
  }

  return {
    questionId: value.questionId,
    type: value.type,
    question: value.question,
    options,
  };
}

function parseAssessment(value: unknown): StepAssessment {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    typeof value.totalQuestions !== "number"
  ) {
    throw new Error("The server returned an invalid assessment.");
  }

  return {
    items: value.items.map(parseAssessmentQuestion),
    totalQuestions: value.totalQuestions,
  };
}

function parseProgressUpdate(value: unknown): StepProgressUpdate {
  if (
    !isRecord(value) ||
    typeof value.status !== "string" ||
    typeof value.progressPercent !== "number" ||
    typeof value.updatedAt !== "string"
  ) {
    throw new Error("The server returned an invalid progress response.");
  }

  const status: StepProgressStatus =
    value.status === "completed"
      ? "completed"
      : value.status === "in_progress"
        ? "in_progress"
        : "not_started";

  return {
    status,
    progressPercent: Math.min(100, Math.max(0, value.progressPercent)),
    updatedAt: value.updatedAt,
  };
}

export const learningDetailService = {
  async getEnrollment(enrollmentId: string, signal?: AbortSignal): Promise<EnrollmentDetail> {
    const response = await apiRequest(
      API_ROUTES.enrollments.detail(enrollmentId),
      parseEnrollmentDetail,
      { ...(signal ? { signal } : {}) },
    );
    return response.data;
  },

  async getStepContent(stepId: string, signal?: AbortSignal): Promise<StepContent> {
    const response = await apiRequest(
      API_ROUTES.steps.detail(stepId),
      parseStepContent,
      { ...(signal ? { signal } : {}) },
    );
    return response.data;
  },

  async getAssessment(stepId: string, signal?: AbortSignal): Promise<StepAssessment> {
    const response = await apiRequest(
      API_ROUTES.steps.assessment(stepId),
      parseAssessment,
      { ...(signal ? { signal } : {}) },
    );
    return response.data;
  },

  async updateProgress(
    enrollmentId: string,
    stepId: string,
    status: StepProgressStatus,
    progressPercent: number,
  ): Promise<StepProgressUpdate> {
    const response = await apiRequest(
      API_ROUTES.enrollments.stepProgress(enrollmentId, stepId),
      parseProgressUpdate,
      {
        method: HTTP_METHODS.PATCH,
        body: { status, progressPercent },
      },
    );
    return response.data;
  },
};
