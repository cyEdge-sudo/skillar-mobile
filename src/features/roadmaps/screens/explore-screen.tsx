import { FeaturePlaceholder, Screen } from "../../../shared/components";
import { UI_COPY } from "../../../core/constants/app.constants";

export function ExploreScreen() {
  return (
    <Screen scroll>
      <FeaturePlaceholder
        title={UI_COPY.placeholders.exploreTitle}
        description={UI_COPY.placeholders.exploreDescription}
      />
    </Screen>
  );
}
