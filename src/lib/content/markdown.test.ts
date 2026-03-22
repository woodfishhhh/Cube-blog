import { describe, expect, it } from "vitest";

import { normalizeArticleMarkdownBody, parseMarkdownDocument } from "@/lib/content/markdown";

describe("normalizeArticleMarkdownBody", () => {
  it("returns the original body when no leading heading is present", () => {
    const body = ["正文第一段", "", "## 小节"].join("\n");

    expect(normalizeArticleMarkdownBody(body, "任意标题")).toBe(body);
  });

  it("removes a duplicate leading title heading and immediate separator noise", () => {
    const normalized = normalizeArticleMarkdownBody(
      [
        "# TypeScript 入门到实战笔记：安装、编译与类型系统",
        "",
        "---",
        "",
        "正文第一段",
      ].join("\n"),
      "TypeScript 入门到实战笔记：安装、编译与类型系统",
    );

    expect(normalized).toBe("正文第一段");
  });

  it("treats surrounding whitespace in the article title as a duplicate-title match", () => {
    expect(
      normalizeArticleMarkdownBody(["# TypeScript", "", "正文第一段"].join("\n"), "  TypeScript  "),
    ).toBe("正文第一段");
  });

  it("keeps a leading heading when it is not the same as the article title", () => {
    const body = ["# TypeScript", "", "正文第一段"].join("\n");

    expect(
      normalizeArticleMarkdownBody(body, "TypeScript 入门到实战笔记：安装、编译与类型系统"),
    ).toBe(body);
  });
});

describe("parseMarkdownDocument", () => {
  it("parses curated frontmatter and returns a normalized render-safe article body", () => {
    const parsed = parseMarkdownDocument(`---
title: "JavaScript 学习笔记（1）：基础语法与数据类型"
date: 2025-11-03 12:38:11
tags:
  - "前端开发"
  - "JavaScript"
categories:
  - "前端开发"
  - "JavaScript"
---

# JavaScript 学习笔记（1）：基础语法与数据类型

> 了解变量、数据类型、运算符等基础概念。

正文第一段
`);

    expect(parsed.frontmatter).toEqual({
      title: "JavaScript 学习笔记（1）：基础语法与数据类型",
      date: "2025-11-03 12:38:11",
      tags: ["前端开发", "JavaScript"],
      categories: ["前端开发", "JavaScript"],
    });
    expect(parsed.body).toBe(["> 了解变量、数据类型、运算符等基础概念。", "", "正文第一段"].join("\n"));
    expect(parsed.excerpt).toContain("了解变量、数据类型、运算符等基础概念");
  });

  it("parses inline tag/category lists and strips optional quotes", () => {
    const parsed = parseMarkdownDocument(`---
title: 'TypeScript 进阶'
date: "2025-01-02"
tags: "前端开发", 'TypeScript', 工程化
categories: "前端开发", "学习笔记"
---

正文第一段
`);

    expect(parsed.frontmatter).toEqual({
      title: "TypeScript 进阶",
      date: "2025-01-02",
      tags: ["前端开发", "TypeScript", "工程化"],
      categories: ["前端开发", "学习笔记"],
    });
    expect(parsed.body).toBe("正文第一段");
  });

  it("throws when required frontmatter is missing", () => {
    expect(() => parseMarkdownDocument("# 只有正文\n\n正文第一段")).toThrowError(
      "Markdown document is missing required frontmatter.",
    );
  });

  it("throws when frontmatter is missing a title", () => {
    expect(() =>
      parseMarkdownDocument(`---
date: 2025-11-03 12:38:11
---

正文第一段
`),
    ).toThrowError("Markdown frontmatter must include title and date.");
  });

  it("throws when frontmatter is missing a date", () => {
    expect(() =>
      parseMarkdownDocument(`---
title: "JavaScript 学习笔记"
---

正文第一段
`),
    ).toThrowError("Markdown frontmatter must include title and date.");
  });
});
