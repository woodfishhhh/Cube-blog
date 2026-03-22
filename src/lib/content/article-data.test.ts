import { beforeEach, describe, expect, it, vi } from "vitest";

import { launchPostManifest } from "../../../content/launch-manifest";

type ArticleDataModule = typeof import("@/lib/content/article-data");

async function importArticleData(): Promise<ArticleDataModule> {
  return import("@/lib/content/article-data");
}

beforeEach(() => {
  vi.resetModules();
});

describe("getArticleStaticParams", () => {
  it("returns curated route params in manifest order", async () => {
    const articleData = await importArticleData();

    expect(articleData.getArticleStaticParams()).toEqual(
      launchPostManifest.map(({ slug }) => ({ slug })),
    );
  });
});

describe("getArticleDataBySlug", () => {
  it("returns parsed article content for a curated slug", async () => {
    const { getArticleDataBySlug } = await importArticleData();
    const result = await getArticleDataBySlug("javascript-basics-and-data-types");

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(`Expected article lookup to succeed, received ${result.reason}`);
    }

    expect(result.value.slug).toBe("javascript-basics-and-data-types");
    expect(result.value.title).toContain("JavaScript");
    expect(result.value.body).toContain("JavaScript 程序不能独立运行");
    expect(result.value.body.startsWith("---")).toBe(false);
  });

  it("returns a safe not-found miss for unknown slugs", async () => {
    const { getArticleDataBySlug } = await importArticleData();

    await expect(getArticleDataBySlug("missing-slug")).resolves.toEqual({
      ok: false,
      reason: "not-found",
      slug: "missing-slug",
    });
  });

  it("propagates missing-source loader misses for known slugs", async () => {
    vi.doMock("@/lib/content/loaders", () => ({
      listLaunchPosts: () => launchPostManifest,
      loadLaunchPostSource: vi.fn().mockResolvedValue({
        ok: false,
        reason: "missing-source",
        slug: "javascript-basics-and-data-types",
        source: {
          sourceRoot: "blog",
          sourcePath: "source/_posts/前端/missing.md",
        },
      }),
    }));

    const { getArticleDataBySlug } = await importArticleData();

    await expect(getArticleDataBySlug("javascript-basics-and-data-types")).resolves.toEqual({
      ok: false,
      reason: "missing-source",
      slug: "javascript-basics-and-data-types",
      source: {
        sourceRoot: "blog",
        sourcePath: "source/_posts/前端/missing.md",
      },
    });
  });

  it("propagates other safe loader misses without trying to map article data", async () => {
    vi.doMock("@/lib/content/loaders", () => ({
      listLaunchPosts: () => launchPostManifest,
      loadLaunchPostSource: vi.fn().mockResolvedValue({
        ok: false,
        reason: "invalid-frontmatter",
        slug: "javascript-basics-and-data-types",
        source: {
          sourceRoot: "blog",
          sourcePath: "source/_posts/前端/invalid.md",
        },
      }),
    }));

    const { getArticleDataBySlug } = await importArticleData();

    await expect(getArticleDataBySlug("javascript-basics-and-data-types")).resolves.toEqual({
      ok: false,
      reason: "invalid-frontmatter",
      slug: "javascript-basics-and-data-types",
      source: {
        sourceRoot: "blog",
        sourcePath: "source/_posts/前端/invalid.md",
      },
    });
  });
});
