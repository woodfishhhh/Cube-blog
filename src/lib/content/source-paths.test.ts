import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  getBlogAboutMarkdownPath,
  getBlogAboutYamlPath,
  getBlogConfigPath,
  getBlogLinkYamlPath,
  getBlogSourceRoot,
  getContentSourceRoot,
  getMyBlogSourceRoot,
} from "@/lib/content/source-paths";

describe("content source paths", () => {
  it("keeps all mirrored content roots inside the current project", () => {
    const cwd = path.resolve("C:/workspace/3Dblog");

    expect(getContentSourceRoot(cwd)).toBe(path.resolve(cwd, "content", "source"));
    expect(getMyBlogSourceRoot(cwd)).toBe(path.resolve(cwd, "content", "source", "myblog"));
    expect(getBlogSourceRoot(cwd)).toBe(path.resolve(cwd, "content", "source", "blog"));
    expect(getBlogAboutYamlPath(cwd)).toBe(
      path.resolve(cwd, "content", "source", "blog", "source", "_data", "about.yml"),
    );
    expect(getBlogLinkYamlPath(cwd)).toBe(
      path.resolve(cwd, "content", "source", "blog", "source", "_data", "link.yml"),
    );
    expect(getBlogAboutMarkdownPath(cwd)).toBe(
      path.resolve(cwd, "content", "source", "blog", "source", "about", "index.md"),
    );
    expect(getBlogConfigPath(cwd)).toBe(
      path.resolve(cwd, "content", "source", "blog", "_config.yml"),
    );
  });
});
