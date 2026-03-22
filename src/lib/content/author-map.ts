import type { HomeAuthorData, NormalizedAuthorProfile } from "@/lib/content/types";

export function mapAuthorProfileToHomeAuthorData(author: NormalizedAuthorProfile): HomeAuthorData {
  return {
    displayName: normalizeRequiredText(author.displayName),
    ...toOptionalField("introduction", author.introduction),
    ...toOptionalField("headline", author.headline),
    ...toOptionalField("slogan", author.slogan),
    ...toOptionalField("location", author.location),
    ...toOptionalField("occupation", author.occupation),
    ...toOptionalField("university", author.university),
    ...toOptionalField("major", author.major),
    profileTags: normalizeTextList(author.profileTags),
    focusAreas: normalizeTextList(author.focusAreas),
    ...toOptionalField("avatarUrl", author.avatarUrl),
  };
}

function normalizeRequiredText(value: string): string {
  return value.trim();
}

function normalizeOptionalText(value?: string): string | undefined {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

function normalizeTextList(values: readonly string[]): string[] {
  const normalizedValues = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return Array.from(new Set(normalizedValues));
}

function toOptionalField<Key extends Exclude<keyof HomeAuthorData, "displayName" | "profileTags" | "focusAreas">>(
  key: Key,
  value?: string,
): Partial<Pick<HomeAuthorData, Key>> {
  const normalizedValue = normalizeOptionalText(value);

  return normalizedValue ? { [key]: normalizedValue } as Pick<HomeAuthorData, Key> : {};
}
