import { deriveExcerpt } from "@/lib/content/excerpt";
import type { ParsedMarkdownDocument, RawPostFrontmatter } from "@/lib/content/types";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

type FrontmatterArrayKey = "categories" | "tags";

const ARRAY_KEYS = new Set<FrontmatterArrayKey>(["categories", "tags"]);

export function parseMarkdownDocument(raw: string): ParsedMarkdownDocument {
  const match = raw.match(FRONTMATTER_PATTERN);

  if (!match) {
    throw new Error("Markdown document is missing required frontmatter.");
  }

  const frontmatter = parseFrontmatterBlock(match[1]);
  const body = raw.slice(match[0].length).trim();

  if (!frontmatter.title || !frontmatter.date) {
    throw new Error("Markdown frontmatter must include title and date.");
  }

  return {
    body,
    excerpt: deriveExcerpt(body),
    frontmatter,
  };
}

function parseFrontmatterBlock(block: string): RawPostFrontmatter {
  const result: RawPostFrontmatter = {
    title: "",
    date: "",
    tags: [],
    categories: [],
  };
  let activeArrayKey: FrontmatterArrayKey | null = null;

  for (const rawLine of block.split(/\r?\n/)) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;

    if (indent >= 2 && activeArrayKey && trimmed.startsWith("- ")) {
      result[activeArrayKey].push(stripOptionalQuotes(trimmed.slice(2).trim()));
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (ARRAY_KEYS.has(key as FrontmatterArrayKey)) {
      const arrayKey = key as FrontmatterArrayKey;
      activeArrayKey = rawValue === "" ? arrayKey : null;

      if (rawValue !== "") {
        result[arrayKey] = rawValue
          .split(",")
          .map((value) => stripOptionalQuotes(value.trim()))
          .filter(Boolean);
      }

      continue;
    }

    activeArrayKey = null;

    if (key === "title" || key === "date") {
      result[key] = stripOptionalQuotes(rawValue);
    }
  }

  return result;
}

function stripOptionalQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
