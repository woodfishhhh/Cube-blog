import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleView } from "@/components/article/ArticleView";
import type { ArticleData } from "@/lib/content/types";

const article: ArticleData = {
  slug: "toc-article",
  title: "TOC Article",
  publishedAt: "2026-03-23T00:00:00.000Z",
  publishedLabel: "Mar 23, 2026",
  tags: ["One", "Two"],
  categories: ["Notes"],
  excerpt: "Testing article toc.",
  body: [
    "## 第一节",
    "",
    "内容",
    "",
    "### 小节一",
    "",
    "更多内容",
  ].join("\n"),
};

describe("ArticleView", () => {
  it("renders a right-side table of contents for article headings", () => {
    render(<ArticleView article={article} />);

    expect(screen.getByText("文章目录")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第一节" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "小节一" })).toBeInTheDocument();
  });
});
