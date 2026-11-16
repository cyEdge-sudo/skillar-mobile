import { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import Markdown, { type MarkdownProps } from "react-native-markdown-display";

import { UI_COPY } from "../../../core/constants/app.constants";
import { AppButton, AppCard, AppText } from "../../../shared/components";
import { useTheme } from "../../../shared/theme";
import type { StepContentBlock } from "../content-types";

interface StepContentRendererProps {
  blocks: StepContentBlock[];
  fallbackVideoUrl?: string | null;
  fallbackMarkdown?: string | null;
}

const YOUTUBE_URL_PATTERN =
  /^https:\/\/(?:(?:www|m)\.)?youtube\.com\/|^https:\/\/youtu\.be\//i;

export function StepContentRenderer({
  blocks,
  fallbackVideoUrl,
  fallbackMarkdown,
}: StepContentRendererProps) {
  const { colors, spacing, typography } = useTheme();
  const markdownStyles: NonNullable<MarkdownProps["style"]> = {
    body: { color: colors.text, fontSize: typography.bodyMedium.fontSize, lineHeight: typography.bodyMedium.lineHeight },
    heading1: { color: colors.text, fontSize: typography.headlineSmall.fontSize },
    heading2: { color: colors.text, fontSize: typography.titleLarge.fontSize },
    heading3: { color: colors.text, fontSize: typography.titleMedium.fontSize },
    paragraph: { marginTop: 0, marginBottom: spacing[12] },
    code_inline: { backgroundColor: colors.surfaceVariant, color: colors.text },
    code_block: { backgroundColor: colors.surfaceVariant, color: colors.text, padding: spacing[12] },
    blockquote: { backgroundColor: colors.surfaceVariant, borderLeftColor: colors.primary },
    link: { color: colors.primary },
  };
  const styles = StyleSheet.create({
    block: { gap: spacing[12] },
    slide: { gap: spacing[8], padding: spacing[12], borderRadius: 8, backgroundColor: colors.surfaceVariant },
    code: { padding: spacing[12], borderRadius: 8, backgroundColor: colors.surfaceVariant },
    bullet: { flexDirection: "row", gap: spacing[8] },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing[8] },
  });

  const openVideo = async (url: string) => {
    if (!YOUTUBE_URL_PATTERN.test(url)) return;
    try { await Linking.openURL(url); } catch { /* The device cannot open this URL. */ }
  };

  return (
    <View style={{ gap: spacing[16] }}>
      {blocks.map((block) => (
        <AppCard key={block.id} variant="outlined" style={styles.block}>
          {block.title.length > 0 ? <AppText variant="titleMedium">{block.title}</AppText> : null}
          {block.contentType === "VIDEO" ? (
            block.videos.length > 0 ? block.videos.map((video) => (
              <View key={video.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <AppText>{video.title}</AppText>
                  {video.thumbnail ? <AppText color="textSecondary" variant="labelSmall">{UI_COPY.learning.videoThumbnailAvailable}</AppText> : null}
                </View>
                <AppButton size="small" onPress={() => void openVideo("https://www.youtube.com/watch?v=" + encodeURIComponent(video.id))}>
                  {UI_COPY.learning.openVideo}
                </AppButton>
              </View>
            )) : <AppText color="textSecondary">{UI_COPY.learning.noVideoItems}</AppText>
          ) : null}
          {block.contentType === "TEXT" ? <Markdown style={markdownStyles}>{block.markdown}</Markdown> : null}
          {block.contentType === "CAROUSEL" ? <CarouselSlides slides={block.slides} /> : null}
          {block.contentType === "EXAMPLES" ? block.examples.map((example, index) => (
            <View key={String(index)} style={styles.bullet}>
              <AppText color="primary">•</AppText>
              <AppText style={{ flex: 1 }}>{example}</AppText>
            </View>
          )) : null}
          {block.contentType === "CODE" ? (
            <View style={styles.code}>
              {block.language ? <AppText color="textSecondary" variant="labelSmall">{block.language}</AppText> : null}
              <AppText selectable style={{ fontFamily: "monospace" }}>{block.code}</AppText>
            </View>
          ) : null}
          {block.contentType === "NOTE" ? <AppText>{block.note}</AppText> : null}
          {block.contentType === "QUIZ" ? <QuizQuestions questions={block.questions} /> : null}
        </AppCard>
      ))}
      {blocks.length === 0 && fallbackVideoUrl ? (
        <AppCard variant="outlined" style={styles.block}>
          <AppText variant="titleMedium">{UI_COPY.learning.videoLesson}</AppText>
          <AppButton onPress={() => void openVideo(fallbackVideoUrl)}>{UI_COPY.learning.openVideo}</AppButton>
        </AppCard>
      ) : null}
      {blocks.length === 0 && fallbackMarkdown ? (
        <AppCard variant="outlined"><Markdown style={markdownStyles}>{fallbackMarkdown}</Markdown></AppCard>
      ) : null}
      {blocks.length === 0 && !fallbackVideoUrl && !fallbackMarkdown ? (
        <AppText color="textSecondary">{UI_COPY.learning.noPublishedContent}</AppText>
      ) : null}
    </View>
  );
}

interface CarouselSlide {
  title: string;
  body: string;
  bullets: string[];
}

function CarouselSlides({ slides }: { slides: CarouselSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors, spacing } = useTheme();
  const styles = StyleSheet.create({
    slide: { gap: spacing[8], padding: spacing[12], borderRadius: 8, backgroundColor: colors.surfaceVariant },
    controls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[8] },
  });
  const slide = slides[activeIndex];
  if (!slide) return <AppText color="textSecondary">{UI_COPY.learning.noCarouselSlides}</AppText>;
  return (
    <View style={{ gap: spacing[12] }}>
      <View style={styles.slide}>
        <AppText variant="titleSmall">{slide.title}</AppText>
        <AppText>{slide.body}</AppText>
        {slide.bullets.map((bullet, index) => <AppText key={String(index)}>• {bullet}</AppText>)}
      </View>
      <View style={styles.controls}>
        <AppButton size="small" variant="outline" disabled={activeIndex === 0} onPress={() => setActiveIndex((index) => Math.max(0, index - 1))}>{UI_COPY.learning.previousSlide}</AppButton>
        <AppText color="textSecondary" variant="labelSmall">{String(activeIndex + 1)} / {String(slides.length)}</AppText>
        <AppButton size="small" disabled={activeIndex >= slides.length - 1} onPress={() => setActiveIndex((index) => Math.min(slides.length - 1, index + 1))}>{UI_COPY.learning.nextSlide}</AppButton>
      </View>
    </View>
  );
}

interface QuizQuestion {
  type: string;
  question: string;
  options: Record<string, string>;
}

function QuizQuestions({ questions }: { questions: QuizQuestion[] }) {
  const { colors, spacing } = useTheme();
  const styles = StyleSheet.create({
    question: { gap: spacing[8], padding: spacing[12], borderRadius: 8, backgroundColor: colors.surfaceVariant },
  });
  if (questions.length === 0) return <AppText color="textSecondary">{UI_COPY.learning.noQuizQuestions}</AppText>;
  return (
    <View style={{ gap: spacing[12] }}>
      <AppText color="textSecondary" variant="labelSmall">{UI_COPY.learning.quizPreviewOnly}</AppText>
      {questions.map((question, index) => (
        <View key={String(index)} style={styles.question}>
          <AppText variant="titleSmall">{String(index + 1) + ". " + question.question}</AppText>
          <AppText color="textSecondary" variant="labelSmall">{question.type.replace(/_/g, " ")}</AppText>
          {Object.entries(question.options).map(([key, label]) => (
            <AppText key={key}>{key + ". " + label}</AppText>
          ))}
        </View>
      ))}
    </View>
  );
}
