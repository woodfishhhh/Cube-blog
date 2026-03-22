import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostCard } from "@/components/home/PostCard";

describe("PostCard", () => {
  it("surfaces a compact editorial metadata line without losing taxonomy access", () => {
    render(
      <PostCard
        post={{
          slug: "editorial-metadata",
          title: "Editorial Metadata",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: ["Three.js", "Notes"],
          categories: ["Frontend"],
          excerpt: "A compact metadata line should keep the card readable.",
        }}
      />,
    );

    const article = screen.getByRole("article", { name: /editorial metadata/i });
    const metadata = article.querySelector(".post-card__meta");
    const taxonomy = screen.getByRole("list", { name: /editorial metadata taxonomy/i });

    expect(metadata).not.toBeNull();
    expect(metadata).toHaveTextContent("Mar 21, 2026");
    expect(metadata).toHaveTextContent("Frontend");
    expect(within(taxonomy).getByText("Three.js")).toBeInTheDocument();
    expect(within(taxonomy).getByText("Notes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /editorial metadata/i })).toHaveAttribute(
      "href",
      "/posts/editorial-metadata",
    );
  });

  it("falls back to notes when category metadata is missing", () => {
    render(
      <PostCard
        post={{
          slug: "metadata-fallback",
          title: "Metadata Fallback",
          publishedAt: "2026-03-21 10:00:00",
          publishedLabel: "Mar 21, 2026",
          tags: [],
          categories: [],
          excerpt: "Sparse launch notes still need a readable category cue.",
        }}
      />,
    );

    const article = screen.getByRole("article", { name: /metadata fallback/i });
    const metadata = article.querySelector(".post-card__meta");

    expect(metadata).not.toBeNull();
    expect(metadata).toHaveTextContent("Notes");
    expect(screen.getByRole("list", { name: /metadata fallback taxonomy/i })).toHaveTextContent(
      "Notes",
    );
  });
});
