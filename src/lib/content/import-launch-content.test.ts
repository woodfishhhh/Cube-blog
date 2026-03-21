import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { importLaunchContent } from "../../../scripts/import-launch-content.mjs";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })));
});

async function createTempWorkspace(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "launch-import-"));
  tempRoots.push(root);
  return root;
}

async function writeFixtureFile(root: string, relativePath: string, content: string): Promise<string> {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, { encoding: "utf8", flag: "w" });
  return filePath;
}

async function createImportOptions() {
  const root = await createTempWorkspace();
  const workspaceRoot = path.join(root, "workspace");
  const blogRoot = path.join(root, "Blog");
  const myBlogRoot = path.join(root, "MyBlog");
  const desktopRoot = path.join(root, "Desktop");
  const absoluteAssetPath = path.join(desktopRoot, "legacy-assets", "diagram.png");

  await writeFixtureFile(
    blogRoot,
    "source/_posts/selected.md",
    [
      "---",
      'title: "Selected post"',
      "date: 2026-01-01 09:00:00",
      "tags:",
      '  - "import"',
      "categories:",
      '  - "tests"',
      "---",
      "",
      "Local image: ![chart](images/chart.png)",
      `Absolute image: ![diagram](${absoluteAssetPath.replaceAll("\\", "\\\\")})`,
      "Remote image: ![remote](https://example.com/remote.png)",
      '<img src="images/panel.png" alt="panel" />',
      "",
      "Body text.",
    ].join("\n"),
  );
  await writeFixtureFile(blogRoot, "source/_posts/images/chart.png", "chart-png");
  await writeFixtureFile(blogRoot, "source/_posts/images/panel.png", "panel-png");
  await writeFixtureFile(blogRoot, path.relative(blogRoot, absoluteAssetPath), "absolute-png");

  await writeFixtureFile(
    blogRoot,
    "source/_posts/ignored.md",
    [
      "---",
      'title: "Ignored post"',
      "date: 2026-01-02 09:00:00",
      "tags: []",
      "categories: []",
      "---",
      "",
      "Should not be imported.",
    ].join("\n"),
  );

  await writeFixtureFile(
    blogRoot,
    "source/_data/about.yml",
    [
      "title: 测试站点",
      "authorinfo:",
      "  leftTags:",
      "    - 左侧标签",
      "  rightTags:",
      "    - 右侧标签",
      "  image: https://example.com/avatar.png",
      "contentinfo:",
      "  sup: 你好",
      "  name: 木鱼",
      "  title: 站点作者",
      "  slogan: 热爱驱动",
      "  mask:",
      "    - 学习",
      "    - 创作",
      "oneself:",
      "  location: 南昌",
      "  birthYear: 2006",
      "  university: 江西财经大学",
      "  major: 计算机科学与技术",
      "  occupation: 学生",
    ].join("\n"),
  );

  await writeFixtureFile(
    myBlogRoot,
    "notes/secondary.md",
    [
      "---",
      'title: "Secondary post"',
      "date: 2026-01-03 09:00:00",
      "tags: []",
      "categories: []",
      "---",
      "",
      "Secondary source.",
    ].join("\n"),
  );

  return {
    workspaceRoot,
    authorProfileSource: {
      sourceRoot: "blog" as const,
      sourcePath: "source/_data/about.yml",
    },
    launchPostManifest: [
      {
        slug: "selected-post",
        sourceRoot: "blog" as const,
        sourcePath: "source/_posts/selected.md",
      },
      {
        slug: "secondary-post",
        sourceRoot: "myblog" as const,
        sourcePath: "notes/secondary.md",
      },
    ],
    sourceRoots: {
      blog: blogRoot,
      myblog: myBlogRoot,
    },
    assetSearchRoots: [desktopRoot],
  };
}

describe("importLaunchContent", () => {
  it("imports curated markdown, rewrites local asset references, and normalizes author data", async () => {
    const options = await createImportOptions();

    const result = await importLaunchContent(options);

    expect(result.importedSlugs).toEqual(["secondary-post", "selected-post"]);

    const importedMarkdown = await readFile(
      path.join(options.workspaceRoot, "content/posts/selected-post/index.md"),
      "utf8",
    );

    expect(importedMarkdown).toContain("![chart](/content/selected-post/images/chart.png)");
    expect(importedMarkdown).toContain('<img src="/content/selected-post/images/panel.png" alt="panel" />');
    expect(importedMarkdown).toContain(
      "![diagram](/content/selected-post/absolute/legacy-assets/diagram.png)",
    );
    expect(importedMarkdown).toContain("![remote](https://example.com/remote.png)");
    expect(importedMarkdown).not.toContain("Desktop");

    await expect(
      readFile(path.join(options.workspaceRoot, "content/posts/ignored-post/index.md"), "utf8"),
    ).rejects.toMatchObject({ code: "ENOENT" });

    expect(
      await readFile(path.join(options.workspaceRoot, "public/content/selected-post/images/chart.png"), "utf8"),
    ).toBe("chart-png");
    expect(
      await readFile(
        path.join(options.workspaceRoot, "public/content/selected-post/absolute/legacy-assets/diagram.png"),
        "utf8",
      ),
    ).toBe("absolute-png");

    const authorProfile = JSON.parse(
      await readFile(path.join(options.workspaceRoot, "content/author/profile.json"), "utf8"),
    );

    expect(authorProfile).toEqual({
      avatarUrl: "https://example.com/avatar.png",
      birthYear: 2006,
      displayName: "木鱼",
      focusAreas: ["学习", "创作"],
      headline: "站点作者",
      introduction: "你好",
      location: "南昌",
      major: "计算机科学与技术",
      occupation: "学生",
      profileTags: ["左侧标签", "右侧标签"],
      siteTitle: "测试站点",
      slogan: "热爱驱动",
      source: {
        sourcePath: "source/_data/about.yml",
        sourceRoot: "blog",
      },
      university: "江西财经大学",
    });
  });

  it("fails loudly when a referenced asset is missing", async () => {
    const options = await createImportOptions();
    await rm(path.join(options.sourceRoots.blog, "source/_posts/images/chart.png"), { force: true });

    await expect(importLaunchContent(options)).rejects.toThrowError(
      'Missing referenced asset for slug "selected-post": images/chart.png',
    );
  });

  it("fails loudly when a source markdown file is missing", async () => {
    const options = await createImportOptions();
    await rm(path.join(options.sourceRoots.myblog, "notes/secondary.md"), { force: true });

    await expect(importLaunchContent(options)).rejects.toThrowError(
      'Missing source markdown for slug "secondary-post": notes/secondary.md',
    );
  });

  it("fails loudly when an existing destination would be overwritten by different content", async () => {
    const options = await createImportOptions();

    await writeFixtureFile(
      options.workspaceRoot,
      "content/posts/selected-post/index.md",
      "conflicting-content",
    );

    await expect(importLaunchContent(options)).rejects.toThrowError(
      'Destination already exists with different content: content/posts/selected-post/index.md',
    );
  });
});
