import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { launchPostManifest } from "../../../content/launch-manifest";
import { assertContentSlug } from "@/lib/content/slug";
import type { ContentLookupResult, ContentSourceDescriptor, LaunchManifestEntry } from "@/lib/content/types";

export type LaunchContentRegistry = {
  entries: readonly LaunchManifestEntry[];
  bySlug: ReadonlyMap<string, LaunchManifestEntry>;
};

export type LaunchPostSourcePayload = {
  entry: LaunchManifestEntry;
  filePath: string;
  raw: string;
};

const REPO_CONTENT_ROOT = path.resolve(process.cwd(), "content");

export function createLaunchContentRegistry(
  entries: readonly LaunchManifestEntry[] = launchPostManifest,
): LaunchContentRegistry {
  const bySlug = new Map<string, LaunchManifestEntry>();

  for (const entry of entries) {
    const slug = assertContentSlug(entry.slug);
    const existing = bySlug.get(slug);

    if (existing) {
      throw new Error(
        `Duplicate launch content slug \"${slug}\" for ${entry.sourceRoot}:${entry.sourcePath}; already claimed by ${existing.sourceRoot}:${existing.sourcePath}.`,
      );
    }

    bySlug.set(slug, { ...entry, slug });
  }

  return {
    entries: Array.from(bySlug.values()),
    bySlug,
  };
}

const launchContentRegistry = createLaunchContentRegistry();

export function listLaunchPosts(): readonly LaunchManifestEntry[] {
  return launchContentRegistry.entries;
}

export function getLaunchPostBySlug(slug: string): ContentLookupResult<LaunchManifestEntry> {
  const normalizedSlug = assertContentSlug(slug);
  const entry = launchContentRegistry.bySlug.get(normalizedSlug);

  if (!entry) {
    return {
      ok: false,
      reason: "not-found",
      slug: normalizedSlug,
    };
  }

  return {
    ok: true,
    value: entry,
  };
}

export function resolveRepoLocalContentPath(source: ContentSourceDescriptor): string {
  const sourceRootPath = path.resolve(REPO_CONTENT_ROOT, source.sourceRoot);
  const candidatePath = path.resolve(sourceRootPath, source.sourcePath);

  if (!candidatePath.startsWith(`${sourceRootPath}${path.sep}`) && candidatePath !== sourceRootPath) {
    throw new Error(
      `Content source path must stay within content/${source.sourceRoot}: ${source.sourcePath}`,
    );
  }

  return candidatePath;
}

export function resolveImportedLaunchPostPath(entry: LaunchManifestEntry): string {
  return path.resolve(REPO_CONTENT_ROOT, "posts", entry.slug, "index.md");
}

export async function loadLaunchPostSource(
  slug: string,
): Promise<ContentLookupResult<LaunchPostSourcePayload>> {
  const entryResult = getLaunchPostBySlug(slug);

  if (!entryResult.ok) {
    return entryResult;
  }

  const entry = entryResult.value;
  const filePath = resolveImportedLaunchPostPath(entry);

  try {
    await access(filePath);
  } catch {
    return {
      ok: false,
      reason: "missing-source",
      slug: entry.slug,
      source: {
        sourceRoot: entry.sourceRoot,
        sourcePath: entry.sourcePath,
      },
    };
  }

  return {
    ok: true,
    value: {
      entry,
      filePath,
      raw: await readFile(filePath, "utf8"),
    },
  };
}
