import { NAVIGATION_ROUTES } from "../../core/constants/app.constants";

export type AuthStackParamList = {
  [NAVIGATION_ROUTES.auth.login]: undefined;
  [NAVIGATION_ROUTES.auth.signup]: undefined;
  [NAVIGATION_ROUTES.auth.forgotPassword]: undefined;
};

export type MainTabParamList = {
  [NAVIGATION_ROUTES.tabs.dashboard]: undefined;
  [NAVIGATION_ROUTES.tabs.explore]: undefined;
  [NAVIGATION_ROUTES.tabs.learning]: undefined;
  [NAVIGATION_ROUTES.tabs.profile]: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  RoadmapDetail: { roadmapId: string; enrollmentId?: number };
  StepContent: {
    enrollmentId: number;
    stepId: string;
    stepTitle: string;
    progressStatus: "not_started" | "in_progress" | "completed";
    progressPercent: number;
  };
};
