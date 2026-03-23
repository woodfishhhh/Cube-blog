import { beforeEach, describe, expect, it, vi } from "vitest";

type ArticleDataModule = typeof import("@/lib/content/article-data");

const mockPosts = [
  {
    slug: "javascript-basics-and-data-types",
    title: "JavaScript 学习笔记（1）：基础语法与数据类型",
    publishedAt: "2025-11-03T00:00:00.000Z",
    publishedLabel: "Nov 03, 2025",
    tags: ["JavaScript", "Basics"],
    categories: ["Frontend"],
    excerpt: "A concise introduction to JavaScript basics.",
    content: "JavaScript 程序不能独立运行，需要运行在浏览器或 Node.js 中。",
  },
  {
    slug: "sql-ddl-query-basics",
    title: "SQL 基础：DDL、表定义与查询核心",
    publishedAt: "2026-03-14T00:00:00.000Z",
    publishedLabel: "Mar 14, 2026",
    tags: ["SQL"],
    categories: ["Database"],
    excerpt: "Core SQL definitions and query patterns.",
    content: "CREATE TABLE students (...);",
  },
];

async function importArticleData(): Promise<ArticleDataModule> {
  return import("@/lib/content/article-data");
}

beforeEach(() => {
  vi.resetModules();
  vi.doMock("@/lib/content/myblog-loaders", () => ({
    getMyBlogPosts: vi.fn().mockResolvedValue(mockPosts),
  }));
});

describe("getArticleStaticParams", () => {
  it("returns route params in mirrored post order", async () => {
    const articleData = await importArticleData();

    await expect(articleData.getArticleStaticParams()).resolves.toEqual(
      mockPosts.map(({ slug }) => ({ slug })),
    );
  });
});

describe("getArticleDataBySlug", () => {
  it("returns parsed article content for a known slug", async () => {
    const { getArticleDataBySlug } = await importArticleData();
    const result = await getArticleDataBySlug("javascript-basics-and-data-types");

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(`Expected article lookup to succeed, received ${result.reason}`);
    }

    expect(result.value).toMatchObject({
      slug: "javascript-basics-and-data-types",
      title: "JavaScript 学习笔记（1）：基础语法与数据类型",
      publishedLabel: "Nov 03, 2025",
      tags: ["JavaScript", "Basics"],
      categories: ["Frontend"],
      excerpt: "A concise introduction to JavaScript basics.",
    });
    expect(result.value.body).toContain("JavaScript 程序不能独立运行");
  });

  it("returns a safe not-found miss for unknown slugs", async () => {
    const { getArticleDataBySlug } = await importArticleData();

    await expect(getArticleDataBySlug("missing-slug")).resolves.toEqual({
      ok: false,
      reason: "not-found",
    });
  });

  it("keeps independent article records separated by slug", async () => {
    const { getArticleDataBySlug } = await importArticleData();

    const result = await getArticleDataBySlug("sql-ddl-query-basics");

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(`Expected SQL article lookup to succeed, received ${result.reason}`);
    }

    expect(result.value.title).toContain("SQL");
    expect(result.value.categories).toEqual(["Database"]);
    expect(result.value.body).toContain("CREATE TABLE");
  });
});
