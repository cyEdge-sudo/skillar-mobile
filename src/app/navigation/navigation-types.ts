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
  [NAVIGATION_ROUTES.tabs.journeys]: undefined;
  [NAVIGATION_ROUTES.tabs.profile]: undefined;
};

export type RootStackParamList = {
  [NAVIGATION_ROUTES.root.mainTabs]: undefined;
  [NAVIGATION_ROUTES.root.roadmapDetail]: { roadmapId: string; enrollmentId?: number };
  [NAVIGATION_ROUTES.root.journeyDetail]: { enrollmentId: number };
  [NAVIGATION_ROUTES.root.stepContent]: {
    enrollmentId: number;
    stepId: string;
    stepTitle: string;
    progressStatus: "not_started" | "in_progress" | "completed";
    progressPercent: number;
  };
};
