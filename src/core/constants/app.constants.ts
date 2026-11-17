/** Central registry for reusable app strings and fixed values. */
export const FEATURE_FLAGS = {
  // Enable only after backend PR #684 is merged, deployed, and smoke-tested.
  journeys: false,
} as const;

export const APP_CONSTANTS = {
  NAME: "Skillar",
  API_VERSION_PREFIX: "/api/v1",
  API_TIMEOUT_MS: 20_000,
  QUERY_STALE_TIME_MS: 60_000,
  CONTENT_QUERY_STALE_TIME_MS: 24 * 60 * 60 * 1_000,
  QUERY_GC_TIME_MS: 5 * 60_000,
  QUERY_RETRY_COUNT: 1,
  REQUEST_ID_PREFIX: "mobile",
} as const;

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    google: "/auth/google",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    sendOtp: "/auth/otp/send",
    verifyOtp: "/auth/otp/verify",
    forgotPassword: "/auth/password/forgot",
    resetPassword: "/auth/password/reset",
  },
  user: {
    me: "/me",
    updateMe: "/me",
    enrollments: "/me/enrollments",
    progress: "/me/progress",
  },
  journeys: {
    collection: "/me/journeys",
    detail: (enrollmentId: number): string =>
      "/journeys/enrollments/" + encodeURIComponent(String(enrollmentId)),
    completeActivity: (enrollmentId: number, activityId: number): string =>
      "/journeys/enrollments/" +
      encodeURIComponent(String(enrollmentId)) +
      "/activities/" +
      encodeURIComponent(String(activityId)) +
      "/complete",
  },
  roadmaps: {
    collection: "/roadmaps",
    detail: (roadmapId: string): string =>
      "/roadmaps/" + encodeURIComponent(roadmapId),
    enroll: (roadmapId: string): string =>
      "/roadmaps/" + encodeURIComponent(roadmapId) + "/enrollments",
  },
  enrollments: {
    detail: (enrollmentId: string): string =>
      "/enrollments/" + encodeURIComponent(enrollmentId),
    progress: (enrollmentId: string): string =>
      "/enrollments/" + encodeURIComponent(enrollmentId) + "/progress",
    stepProgress: (enrollmentId: string, stepId: string): string =>
      "/enrollments/" + encodeURIComponent(enrollmentId) + "/steps/" +
      encodeURIComponent(stepId) + "/progress",
  },
  steps: {
    detail: (stepId: string): string =>
      "/steps/" + encodeURIComponent(stepId) + "/content",
    assessment: (stepId: string): string =>
      "/steps/" + encodeURIComponent(stepId) + "/assessment",
  },
  assessments: {
    attempts: (assessmentId: string): string =>
      "/assessments/" + encodeURIComponent(assessmentId) + "/attempts",
    attempt: (attemptId: string): string =>
      "/assessment-attempts/" + encodeURIComponent(attemptId),
    submitAttempt: (attemptId: string): string =>
      "/assessment-attempts/" + encodeURIComponent(attemptId) + "/submit",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKENS: "skillar.auth.tokens.v1",
  THEME_PREFERENCE: "skillar.preferences.theme.v1",
} as const;

export const REQUEST_HEADERS = {
  ACCEPT: "Accept",
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  REQUEST_ID: "X-Request-Id",
  IDEMPOTENCY_KEY: "Idempotency-Key",
  JSON: "application/json",
  BEARER_PREFIX: "Bearer ",
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export const AUTH_NEXT_STEPS = {
  VERIFY_EMAIL: "verify_email",
  LOGIN: "login",
} as const;

export const API_FIELDS = {
  USER_ID: "user.id",
  USER_NAME: "user.name",
  USER_EMAIL: "user.email",
  ACCESS_TOKEN: "tokens.accessToken",
  REFRESH_TOKEN: "tokens.refreshToken",
  ACCESS_TOKEN_EXPIRES_AT: "tokens.accessTokenExpiresAt",
  REFRESH_TOKEN_EXPIRES_AT: "tokens.refreshTokenExpiresAt",
} as const;

export const API_ERROR_CODES = {
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
  REQUEST_CANCELLED: "REQUEST_CANCELLED",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  HTTP_ERROR: "HTTP_ERROR",
  REFRESH_TOKEN_MISSING: "REFRESH_TOKEN_MISSING",
  INVALID_TOKEN_RESPONSE: "INVALID_TOKEN_RESPONSE",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  SESSION_REVOKED: "SESSION_REVOKED",
} as const;

export const AUTH_STATUS = {
  RESTORING: "restoring",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  ERROR: "error",
} as const;

export const QUERY_KEYS = {
  all: ["skillar"] as const,
  currentUser: ["skillar", "current-user"] as const,
  roadmaps: ["skillar", "roadmaps"] as const,
  roadmap: (roadmapId: string) =>
    ["skillar", "roadmaps", roadmapId] as const,
  enrollments: ["skillar", "enrollments"] as const,
  enrollment: (enrollmentId: string) =>
    ["skillar", "enrollments", enrollmentId] as const,
  progress: ["skillar", "progress"] as const,
  journeys: ["skillar", "journeys"] as const,
  journey: (enrollmentId: number) =>
    ["skillar", "journeys", enrollmentId] as const,
  stepContent: (stepId: string) =>
    ["skillar", "steps", stepId, "content"] as const,
  stepAssessment: (stepId: string) =>
    ["skillar", "steps", stepId, "assessment"] as const,
} as const;

export const NAVIGATION_ROUTES = {
  root: {
    mainTabs: "MainTabs",
    roadmapDetail: "RoadmapDetail",
    stepContent: "StepContent",
    journeyDetail: "JourneyDetail",
  },
  auth: {
    login: "Login",
    signup: "SignUp",
    forgotPassword: "ForgotPassword",
  },
  tabs: {
    dashboard: "Dashboard",
    explore: "Explore",
    learning: "Learning",
    journeys: "Journeys",
    profile: "Profile",
  },
} as const;

export const NAVIGATION_LABELS = {
  dashboard: "Home",
  explore: "Explore",
  learning: "My Learning",
  journeys: "Journeys",
  profile: "Profile",
} as const;

export const FORM_VALIDATION = {
  emailPattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  dateOnlyPattern: /^\\d{4}-\\d{2}-\\d{2}$/,
  passwordMinLength: 8,
} as const;

export const UI_COPY = {
  common: {
    retry: "Retry",
    loading: "Loading Skillar…",
    continue: "Continue",
    cancel: "Cancel",
    back: "Back",
    save: "Save",
    loadMore: "Load more",
  },
  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Sign in to continue learning.",
    emailLabel: "Email address",
    emailPlaceholder: "name@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginAction: "Sign in",
    signupAction: "Create account",
    forgotPasswordAction: "Forgot password?",
    noAccount: "New to Skillar?",
    signupTitle: "Create your account",
    signupSubtitle: "Set up your learner account.",
    nameLabel: "Full name",
    namePlaceholder: "Enter your name",
    dateOfBirthLabel: "Date of birth (YYYY-MM-DD)",
    dateOfBirthPlaceholder: "YYYY-MM-DD",
    createAccountAction: "Create account",
    haveAccount: "Already have an account?",
    resetTitle: "Reset your password",
    resetSubtitle:
      "Enter your email. We will send reset instructions if an account exists.",
    sendResetAction: "Send reset instructions",
    resetRequestSent:
      "If the email is registered, reset instructions will be sent.",
    requiredFields: "Complete all required fields.",
    invalidEmail: "Enter a valid email address.",
    invalidDateOfBirth: "Enter your date of birth in YYYY-MM-DD format.",
    passwordTooShort: "Your password must contain at least 8 characters.",
    signupSuccess:
      "Your account request was received. Follow the next step sent to your email.",
  },
  roadmaps: {
    exploreTitle: "Explore roadmaps",
    exploreDescription: "Find a learning path that matches your goals.",
    searchPlaceholder: "Search roadmaps",
    searchAccessibilityLabel: "Search roadmaps",
    filterAccessibilityPrefix: "Filter by ",
    enrolledAccessibilitySuffix: "enrolled",
    enrollAccessibilityPrefix: "Enroll in ",
    retryMessage: "Try again in a moment.",
    enrollFailedMessage: "Enrollment failed. Please try again.",
    loading: "Loading roadmaps…",
    unavailable: "Roadmaps are unavailable",
    noMatches: "No roadmaps match your search.",
    viewDetails: "View details",
    enroll: "Enroll",
    enrolled: "Enrolled",
    enrollInRoadmap: "Enroll in roadmap",
    hoursSuffix: "hours",
    weeksSuffix: "weeks",
    stepsSuffix: "steps",
    progressOf: "of",
    progressCompleted: "completed",
    levelFilters: {
      all: "All levels",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    ready: "Ready",
    pending: "Pending",
    completed: "Completed",
  },
  journeys: {
    title: "My journeys",
    description: "Follow your assigned learning programmes and complete their activities.",
    loading: "Loading your journeys…",
    unavailable: "Journeys are unavailable",
    refreshFailed: "Your saved journey data is shown, but the latest refresh failed.",
    empty: "You do not have any assigned journeys yet.",
    open: "View journey",
    detailTitle: "Journey details",
    noStages: "This journey has no stages yet.",
    noActivities: "No activities in this stage.",
    locked: "Locked",
    completed: "Completed",
    inProgress: "In progress",
    pending: "Not started",
    overdue: "Overdue",
    unknownStatus: "Unknown status",
    completeActivity: "Mark activity complete",
    completionFailed: "Activity completion could not be saved.",
    task: "Task",
    video: "Video",
    document: "Document",
    acknowledgement: "Acknowledgement",
    assessment: "Assessment",
    roadmap: "Roadmap",
    scorm: "SCORM",
    documentUnavailable: "This document is not available in the mobile app yet.",
    assessmentReadOnly: "Assessment answers cannot be submitted in this version.",
    assessmentNoQuestions: "No assessment questions are available.",
    roadmapCompletion: "Complete the linked roadmap to finish this activity.",
    openVideo: "Open video",
    unsupportedVideoUrl: "This video link is not supported in the mobile app.",
    scormUnsupported: "Open this SCORM activity on the web to view its content.",
    unsupportedActivity: "This activity type is not supported in the mobile app yet.",
    progress: "Progress",
    stage: "Stage",
    activity: "Activity",
  },
  learning: {
    myLearningTitle: "My learning",
    notStarted: "Not started",
    dateUnavailable: "Date unavailable",
    myLearningDescription: "Track your enrolled roadmaps and learning progress.",
    loadingEnrollments: "Loading your learning…",
    dataUnavailable: "Learning data is unavailable",
    emptyEnrollments: "You have not enrolled in any roadmaps yet. Explore roadmaps to get started.",
    lastActivityPrefix: "Last activity:",
    openRoadmap: "Open roadmap",
    statusLabels: {
      active: "In progress",
      enrolled: "In progress",
      assigned: "Assigned",
      completed: "Completed",
      paused: "Paused",
      dropped: "Dropped",
      unknown: "Unknown status",
    },
    detailTitle: "Learning roadmap",
    continueLearning: "Continue learning",
    markComplete: "Mark as complete",
    completed: "Completed",
    pendingContent: "This step does not have published content yet.",
    contentUnavailable: "Step content is unavailable.",
    assessmentTitle: "Knowledge check",
    assessmentUnavailable: "No assessment is available for this step.",
    readOnlyAssessment: "You can review the questions here. Answer submission is not available yet.",
    openVideo: "Open video",
    noSteps: "No learning steps are available yet.",
    backToRoadmap: "Back to roadmap",
    stepContentSubtitle: "Step learning content",
    loadingStep: "Loading step content…",
    stepUnavailable: "Step content unavailable",
    videoLesson: "Video lesson",
    videoSuffix: "video",
    videoThumbnailAvailable: "Video preview available",
    noVideoItems: "No videos are available in this block.",
    noCarouselSlides: "No carousel slides are available.",
    previousSlide: "Previous",
    nextSlide: "Next",
    noQuizQuestions: "No quiz questions are available.",
    quizPreviewOnly: "Review these questions. Answer submission is not available yet.",
    hideQuestions: "Hide questions",
    viewQuestions: "View questions",
    noPublishedContent: "This step does not have published content yet.",
    unsupportedContentBlock: "This content block is not supported in this app version."
    progressSaveFailed: "Progress could not be saved.",
    roadmapUnavailable: "This roadmap could not be loaded.",
    loadingRoadmap: "Loading roadmap…",
    roadmapStatus: "Roadmap unavailable",
    back: "Back",
    openStep: "Open step",
    reviewStep: "Review step",
    previousStep: "Previous step",
    nextStep: "Next step",
    stepPositionPrefix: "Step",
    stepPositionSeparator: "of",
    stepNumberSeparator: ". ",
    questionNumberSeparator: ". ",
    optionNumberSeparator: ". ",
    progressAccessibilitySuffix: "progress",
    minutesSuffix: "min",
    statusReady: "Ready",
    statusPending: "Pending",
    statusCompleted: "Completed",
    enrollFailed: "Enrollment failed.",
  },
  dashboard: {
    greeting: "Your learning, in one place",
    description: "Continue a roadmap or explore a new skill.",
    activeLearning: "My learning",
    discoverRoadmaps: "Explore roadmaps",
    profile: "Profile",
    comingSoonTitle: "Your learning dashboard",
    comingSoonDescription:
      "Your learning activity will appear here when the learner APIs are available.",
    apiNotConnected: "Backend integration is not available yet.",
  },
  profile: {
    title: "Your profile",
    signOut: "Sign out",
    signOutDescription: "End this session on this device.",
    signOutFailed: "This device was signed out, but the server could not confirm session revocation.",
  },
  placeholders: {
    exploreTitle: "Explore roadmaps",
    exploreDescription:
      "Browse and search learning roadmaps when the roadmap API is ready.",
    learningTitle: "My learning",
    learningDescription:
      "Your enrolled roadmaps and learning progress will appear here.",
  },
} as const;

export const APP_MESSAGES = {
  apiNotConfigured:
    "API is not configured. Set EXPO_PUBLIC_API_BASE_URL in your environment.",
  networkUnavailable:
    "Unable to connect. Check your internet connection and try again.",
  requestTimedOut: "The request timed out. Please try again.",
  requestCancelled: "The request was cancelled.",
  serviceUnavailable:
    "The service is temporarily unavailable. Please try again.",
  requestFailed: "The request could not be completed.",
  invalidServerResponse: "The server returned an invalid response.",
  sessionExpired: "Your session has expired. Please sign in again.",
  invalidTokenResponse:
    "The server returned an invalid token response.",
  unknownError: "Something went wrong. Please try again.",
  restoreSessionFailed:
    "Your saved session could not be checked. Check your connection and try again.",
  invalidPasswordResetResponse: "The server returned an invalid password reset response.",
  invalidLogoutResponse: "The server returned an invalid logout response.",
  authProviderMissing: "useAuth must be used within AuthProvider.",
} as const;
