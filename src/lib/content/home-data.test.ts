import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { launchPostManifest } from "../../../content/launch-manifest";
import type { LaunchManifestEntry } from "@/lib/content/types";

type HomeDataModule = typeof import("@/lib/content/home-data");

async function importHomeData(): Promise<HomeDataModule> {
  return import("@/lib/content/home-data");
}

async function withTemporaryWorkingContent<T>(profile: unknown, run: () => Promise<T>) {
  const previousCwd = process.cwd();
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "3dblog-home-data-"));
  const authorDir = path.join(tempRoot, "content", "author");

  await mkdir(authorDir, { recursive: true });
  await writeFile(path.join(authorDir, "profile.json"), JSON.stringify(profile), "utf8");

  process.chdir(tempRoot);

  try {
    return await run();
  } finally {
    process.chdir(previousCwd);
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function buildMarkdownDocument(options: {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  body?: string;
}) {
  const body = options.body ?? "Curated launch excerpt.\n\nMore detail follows.";

  return [
    "---",
    `title: \"${options.title}\"`,
    `date: ${options.date}`,
    "tags:",
    ...options.tags.map((item) => `  - \"${item}\"`),
    "categories:",
    ...options.categories.map((item) => `  - \"${item}\"`),
    "---",
    "",
    body,
  ].join("\n");
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("@/lib/content/loaders");
});

describe("getHomeData", () => {
  it("preserves manifest order for the real homepage launch cards", async () => {
    const { getHomeData } = await importHomeData();
    const data = await getHomeData();

    expect(data.posts.map((post) => post.slug)).toEqual(
      launchPostManifest.map((entry) => entry.slug),
    );
  });

  it("keeps curated cards in manifest order and normalizes post metadata labels", async () => {
    const manifestEntries: LaunchManifestEntry[] = [
      {
        slug: "second-launch-note",
        sourceRoot: "myblog",
        sourcePath: "notes/second.md",
      },
      {
        slug: "first-launch-note",
        sourceRoot: "blog",
        sourcePath: "notes/first.md",
      },
    ];

    const rawBySlug: Record<string, string> = {
      "second-launch-note": buildMarkdownDocument({
        title: "Second launch note",
        date: "2025-12-20 12:00:03",
        categories: ["Algorithms", "", "Algorithms", "Contest Math"],
        tags: ["MEX", "Intervals", "MEX", "  "],
      }),
      "first-launch-note": buildMarkdownDocument({
        title: "First launch note",
        date: "2025-11-03 12:38:11",
        categories: ["Frontend", "Frontend"],
        tags: ["JavaScript", "JavaScript", "DOM"],
      }),
    };

    vi.doMock("@/lib/content/loaders", () => ({
      listLaunchPosts: () => manifestEntries,
      loadLaunchPostSource: async (slug: string) => ({
        ok: true as const,
        value: {
          entry: manifestEntries.find((entry) => entry.slug === slug) ?? manifestEntries[0],
          filePath: `${slug}.md`,
          raw: rawBySlug[slug],
        },
      }),
    }));

    const data = await withTemporaryWorkingContent(
      {
        displayName: "木鱼",
        profileTags: ["Builder"],
        focusAreas: ["Systems"],
      },
      async () => {
        const { getHomeData } = await importHomeData();
        return getHomeData();
      },
    );

    expect(data.posts.map((post) => post.slug)).toEqual([
      "second-launch-note",
      "first-launch-note",
    ]);
    expect(data.posts[0]).toMatchObject({
      publishedLabel: "Dec 20, 2025",
      categories: ["Algorithms", "Contest Math"],
      tags: ["MEX", "Intervals"],
    });
    expect(data.posts[1]).toMatchObject({
      publishedLabel: "Nov 03, 2025",
      categories: ["Frontend"],
      tags: ["JavaScript", "DOM"],
    });
  });

  it("maps the author profile through a strict homepage boundary", async () => {
    vi.doMock("@/lib/content/loaders", () => ({
      listLaunchPosts: () => [],
      loadLaunchPostSource: vi.fn(),
    }));

    const data = await withTemporaryWorkingContent(
      {
        displayName: "Woodfish",
        headline: "Student builder",
        profileTags: ["Builder", "Builder", ""],
        focusAreas: ["Interactive systems", "", "Interactive systems"],
        source: {
          sourceRoot: "blog",
          sourcePath: "source/_data/about.yml",
        },
        birthYear: 2006,
        nested: {
          raw: true,
        },
      },
      async () => {
        const { getHomeData } = await importHomeData();
        return getHomeData();
      },
    );

    expect(data.author).toEqual({
      displayName: "Woodfish",
      headline: "Student builder",
      profileTags: ["Builder"],
      focusAreas: ["Interactive systems"],
    });
  });

  it("omits missing or blank optional author metadata from the homepage view model", async () => {
    vi.doMock("@/lib/content/loaders", () => ({
      listLaunchPosts: () => [],
      loadLaunchPostSource: vi.fn(),
    }));

    const data = await withTemporaryWorkingContent(
      {
        displayName: "  木鱼  ",
        introduction: "   ",
        headline: "",
        slogan: " ",
        location: "  ",
        occupation: "",
        university: " ",
        major: "",
        avatarUrl: "   ",
        profileTags: ["", "  "],
        focusAreas: ["", "  "],
        source: {
          sourceRoot: "blog",
          sourcePath: "source/_data/about.yml",
        },
        raw: {
          nested: true,
        },
      },
      async () => {
        const { getHomeData } = await importHomeData();
        return getHomeData();
      },
    );

    expect(data.author).toEqual({
      displayName: "木鱼",
      profileTags: [],
      focusAreas: [],
    });
    expect(data.author).not.toHaveProperty("raw");
    expect(data.author).not.toHaveProperty("source");
    expect(data.author).not.toHaveProperty("headline");
    expect(data.author).not.toHaveProperty("avatarUrl");
  });
});
