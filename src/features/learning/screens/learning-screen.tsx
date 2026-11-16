import { FeaturePlaceholder, Screen } from "../../../shared/components";
import { UI_COPY } from "../../../core/constants/app.constants";

export function LearningScreen() {
  return (
    <Screen scroll>
      <FeaturePlaceholder
        title={UI_COPY.placeholders.learningTitle}
        description={UI_COPY.placeholders.learningDescription}
      />
    </Screen>
  );
}
