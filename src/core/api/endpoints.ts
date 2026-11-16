export const API_ENDPOINTS = {
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
  me: {
    profile: "/me",
    enrollments: "/me/enrollments",
    progress: "/me/progress",
  },
  roadmaps: "/roadmaps",
  steps: (stepId: string) => "/steps/" + encodeURIComponent(stepId),
  enrollment: (enrollmentId: string) =>
    "/enrollments/" + encodeURIComponent(enrollmentId),
} as const;
