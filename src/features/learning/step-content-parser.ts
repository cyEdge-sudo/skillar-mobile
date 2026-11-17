import type { StepContentBlock } from "./content-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonContent(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function parseStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

function createUnsupportedContentBlock(value: unknown, index: number): StepContentBlock {
  const record = isRecord(value) ? value : {};
  return {
    id: typeof record.id === "string" && record.id.trim().length > 0
      ? record.id
      : "unsupported-" + String(index),
    title: typeof record.title === "string" ? record.title : "",
    contentType: "UNSUPPORTED",
    originalContentType:
      typeof record.contentType === "string" && record.contentType.trim().length > 0
        ? record.contentType
        : "UNKNOWN",
  };
}

function parseContentBlock(value: unknown): StepContentBlock {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    value.id.trim().length === 0 ||
    typeof value.contentType !== "string"
  ) {
    throw new Error("The server returned an invalid step content block.");
  }

  const title = typeof value.title === "string" ? value.title : "";
  const content = parseJsonContent(value.content);
  const base = { id: value.id, title };

  switch (value.contentType) {
    case "VIDEO": {
      if (!Array.isArray(content)) {
        throw new Error("The server returned invalid video lesson content.");
      }
      const videos = content.flatMap((item) => {
        if (!isRecord(item) || typeof item.id !== "string") return [];
        return [{
          id: item.id,
          title: typeof item.title === "string" ? item.title : title,
          thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : null,
        }];
      });
      return { ...base, contentType: "VIDEO", videos };
    }
    case "TEXT":
      if (typeof content !== "string") {
        throw new Error("The server returned invalid text lesson content.");
      }
      return { ...base, contentType: "TEXT", markdown: content };
    case "CAROUSEL": {
      if (!Array.isArray(content)) {
        throw new Error("The server returned invalid carousel content.");
      }
      const slides = content.flatMap((item) => {
        if (!isRecord(item)) return [];
        return [{
          title: typeof item.title === "string" ? item.title : "",
          body: typeof item.body === "string" ? item.body : "",
          bullets: Array.isArray(item.bullets)
            ? item.bullets.filter((bullet): bullet is string => typeof bullet === "string")
            : [],
        }];
      });
      return { ...base, contentType: "CAROUSEL", slides };
    }
    case "EXAMPLES":
      if (!Array.isArray(content) || !content.every((item): item is string => typeof item === "string")) {
        throw new Error("The server returned invalid examples content.");
      }
      return { ...base, contentType: "EXAMPLES", examples: content };
    case "CODE": {
      if (typeof content !== "string") {
        throw new Error("The server returned invalid code content.");
      }
      const newline = content.indexOf("\n");
      const firstLine = newline >= 0 ? content.slice(0, newline).trim() : "";
      const hasLanguage = /^[a-zA-Z0-9_+#.-]{1,24}$/.test(firstLine);
      return {
        ...base,
        contentType: "CODE",
        language: hasLanguage ? firstLine : null,
        code: hasLanguage ? content.slice(newline + 1) : content,
      };
    }
    case "NOTE":
      if (typeof content !== "string") {
        throw new Error("The server returned invalid note content.");
      }
      return { ...base, contentType: "NOTE", note: content };
    case "QUIZ": {
      if (!Array.isArray(content)) {
        throw new Error("The server returned invalid quiz content.");
      }
      const questions = content.flatMap((item) => {
        if (!isRecord(item) || typeof item.question !== "string") return [];
        return [{
          type: typeof item.type === "string" ? item.type : "UNKNOWN",
          question: item.question,
          options: parseStringRecord(item.options),
        }];
      });
      return { ...base, contentType: "QUIZ", questions };
    }
    default:
      return createUnsupportedContentBlock(value, 0);
  }
}

export function parseStepContentBlocks(value: unknown): StepContentBlock[] {
  if (!Array.isArray(value)) return [];
  return value.map((block, index) => {
    try {
      return parseContentBlock(block);
    } catch {
      return createUnsupportedContentBlock(block, index);
    }
  });
}
