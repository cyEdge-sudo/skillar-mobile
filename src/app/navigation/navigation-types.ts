import { NAVIGATION_ROUTES } from '../../core/constants/app.constants';
import type { JourneyDetailRouteParams } from '../../features/journeys';
import type { StepContentRouteParams } from '../../features/learning';
import type { RoadmapDetailRouteParams } from '../../features/roadmaps';

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
  [NAVIGATION_ROUTES.root.roadmapDetail]: RoadmapDetailRouteParams;
  [NAVIGATION_ROUTES.root.journeyDetail]: JourneyDetailRouteParams;
  [NAVIGATION_ROUTES.root.stepContent]: StepContentRouteParams;
};
