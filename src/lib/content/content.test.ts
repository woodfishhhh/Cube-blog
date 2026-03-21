import { describe, expect, it } from "vitest";

import { deriveExcerpt } from "@/lib/content/excerpt";
import {
  createLaunchContentRegistry,
  getLaunchPostBySlug,
  loadLaunchPostSource,
} from "@/lib/content/loaders";
import type { LaunchManifestEntry } from "@/lib/content/types";

describe("createLaunchContentRegistry", () => {
  it("rejects duplicate slugs deterministically", () => {
    const duplicateEntries = [
      {
        slug: "same-slug",
        sourceRoot: "blog",
        sourcePath: "first.md",
      },
      {
        slug: "same-slug",
        sourceRoot: "myblog",
        sourcePath: "second.md",
      },
    ] satisfies LaunchManifestEntry[];

    expect(() => createLaunchContentRegistry(duplicateEntries)).toThrowError(
      "Duplicate launch content slug \"same-slug\" for myblog:second.md; already claimed by blog:first.md.",
    );
  });
});

describe("getLaunchPostBySlug", () => {
  it("returns a safe not-found result for a missing slug", () => {
    expect(getLaunchPostBySlug("missing-slug")).toEqual({
      ok: false,
      reason: "not-found",
      slug: "missing-slug",
    });
  });
});

describe("loadLaunchPostSource", () => {
  it("loads curated repo-local markdown after the importer has populated content", async () => {
    const result = await loadLaunchPostSource("javascript-basics-and-data-types");

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(`Expected imported content to exist, received ${result.reason}`);
    }

    expect(result.value.entry).toEqual({
      slug: "javascript-basics-and-data-types",
      sourceRoot: "blog",
      sourcePath: "source/_posts/前端/JavaScript 学习笔记（1）：基础语法与数据类型.md",
    });
    expect(result.value.filePath.replaceAll("\\", "/")).toContain(
      "content/posts/javascript-basics-and-data-types/index.md",
    );
    expect(result.value.raw).toContain('# JavaScript 学习笔记（1）：基础语法与数据类型');
  });
});

describe("deriveExcerpt", () => {
  it("strips markdown noise and produces a deterministic excerpt", () => {
    const excerpt = deriveExcerpt(`
      # Heading

      Intro paragraph with **bold** text and [link](https://example.com).

      > Quote line

      - bullet one
      - bullet two

      \`inline code\`
    `);

    expect(excerpt).toBe(
      "Heading Intro paragraph with bold text and link. Quote line bullet one bullet two inline code",
    );
  });
});
