import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleView } from "@/components/article/ArticleView";

describe("ArticleView", () => {
  it("renders article metadata and markdown body content", () => {
    render(
      <ArticleView
        article={{
          slug: "demo-post",
          title: "Demo Post",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: ["JavaScript", "Study"],
          categories: ["Notes"],
          excerpt: "A compact article excerpt.",
          body: "## Section heading\n\nA body paragraph with **strong** text.",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Demo Post" })).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Mar 21, 2026")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("JavaScript / Study")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Section heading" })).toBeInTheDocument();
    expect(screen.getByText(/a body paragraph with/i)).toBeInTheDocument();
  });

  it("falls back to readable metadata labels when taxonomy fields are empty", () => {
    render(
      <ArticleView
        article={{
          slug: "fallback-meta",
          title: "Fallback Meta",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: [],
          categories: [],
          excerpt: "Metadata should stay readable when taxonomy data is sparse.",
          body: "Body copy stays visible.",
        }}
      />,
    );

    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("No tags")).toBeInTheDocument();
  });

  it("does not render a duplicate top-level heading when markdown repeats the article title", () => {
    render(
      <ArticleView
        article={{
          slug: "duplicate-title",
          title: "Same Title",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: [],
          categories: ["Notes"],
          excerpt: "Repeated title should be normalized.",
          body: "# Same Title\n\nBody copy after the repeated heading.",
        }}
      />,
    );

    expect(
      screen.getAllByRole("heading", { name: "Same Title", level: 1 }),
    ).toHaveLength(1);
    expect(screen.getByText(/body copy after the repeated heading/i)).toBeInTheDocument();
  });

  it("exposes a named article content landmark so keyboard users can jump straight to markdown content", () => {
    render(
      <ArticleView
        article={{
          slug: "focusable-content",
          title: "Focusable Content",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: ["Accessibility"],
          categories: ["Notes"],
          excerpt: "Keyboard users need a stable way to reach article content.",
          body: "Paragraph copy with a [reference link](https://example.com/reference).",
        }}
      />,
    );

    const contentRegion = screen.getByRole("region", {
      name: /focusable content content/i,
    });

    expect(contentRegion).toHaveAttribute("tabindex", "-1");
    expect(within(contentRegion).getByRole("link", { name: /reference link/i })).toHaveAttribute(
      "href",
      "https://example.com/reference",
    );
  });
});
