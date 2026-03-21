const DEFAULT_EXCERPT_LENGTH = 160;

export function deriveExcerpt(source: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
  const normalized = source
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`>#-]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return normalized.slice(0, maxLength).trimEnd();
}
