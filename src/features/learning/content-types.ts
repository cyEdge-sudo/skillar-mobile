export type StepContentType = 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'EXAMPLES' | 'CODE' | 'NOTE' | 'QUIZ';

export interface StepContentBase {
  id: string;
  contentType: StepContentType;
  title: string;
}

export interface VideoContentBlock extends StepContentBase {
  contentType: 'VIDEO';
  videos: Array<{ id: string; title: string; thumbnail: string | null }>;
}

export interface TextContentBlock extends StepContentBase {
  contentType: 'TEXT';
  markdown: string;
}

export interface CarouselContentBlock extends StepContentBase {
  contentType: 'CAROUSEL';
  slides: Array<{ title: string; body: string; bullets: string[] }>;
}

export interface ExamplesContentBlock extends StepContentBase {
  contentType: 'EXAMPLES';
  examples: string[];
}

export interface CodeContentBlock extends StepContentBase {
  contentType: 'CODE';
  language: string | null;
  code: string;
}

export interface NoteContentBlock extends StepContentBase {
  contentType: 'NOTE';
  note: string;
}

export interface QuizContentBlock extends StepContentBase {
  contentType: 'QUIZ';
  questions: Array<{
    type: string;
    question: string;
    options: Record<string, string>;
  }>;
}

export type StepContentBlock =
  | VideoContentBlock
  | TextContentBlock
  | CarouselContentBlock
  | ExamplesContentBlock
  | CodeContentBlock
  | NoteContentBlock
  | QuizContentBlock
  | UnsupportedContentBlock;

export interface UnsupportedContentBlock {
  id: string;
  title: string;
  contentType: 'UNSUPPORTED';
  originalContentType: string;
}
