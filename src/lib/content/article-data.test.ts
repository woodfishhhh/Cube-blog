import { describe, expect, it } from "vitest";

import { getArticleDataBySlug } from "@/lib/content/article-data";

describe("getArticleDataBySlug", () => {
  it("returns parsed article content for a curated slug", async () => {
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
    await expect(getArticleDataBySlug("missing-slug")).resolves.toEqual({
      ok: false,
      reason: "not-found",
      slug: "missing-slug",
    });
  });
});
