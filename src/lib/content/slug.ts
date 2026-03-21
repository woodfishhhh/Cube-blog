const CONTENT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isContentSlug(value: string): boolean {
  return CONTENT_SLUG_PATTERN.test(value);
}

export function assertContentSlug(value: string): string {
  if (!isContentSlug(value)) {
    throw new Error(
      `Invalid content slug \"${value}\". Slugs must be lowercase ASCII words joined by hyphens.`,
    );
  }

  return value;
}
