import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostList } from "@/components/dom/PostList";
import type { Post } from "@/lib/data";

const posts: Post[] = [
  {
    id: "first-post",
    title: "First Post",
    date: "2026-03-23T00:00:00.000Z",
    excerpt: "First excerpt",
    categories: [],
    tags: [],
    content: "First content",
    filePath: "content/posts/first-post/index.md",
  },
  {
    id: "second-post",
    title: "Second Post",
    date: "2026-03-22T00:00:00.000Z",
    excerpt: "Second excerpt",
    categories: [],
    tags: [],
    content: "Second content",
    filePath: "content/posts/second-post/index.md",
  },
];

describe("PostList", () => {
  it("renders all recent post cards as immediately visible content", () => {
    render(<PostList posts={posts} />);

    expect(screen.getByRole("heading", { name: "First Post" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Second Post" })).toBeVisible();
    expect(screen.getByText("First excerpt")).toBeVisible();
    expect(screen.getByText("Second excerpt")).toBeVisible();
  });
});
