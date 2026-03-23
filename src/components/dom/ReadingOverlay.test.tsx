import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ReadingOverlay } from "@/components/dom/ReadingOverlay";
import type { Post } from "@/lib/data";
import { useStore } from "@/store/store";

const posts: Post[] = [
  {
    id: "post-1",
    title: "Transparent Overlay",
    date: "2026-03-23T00:00:00.000Z",
    excerpt: "excerpt",
    categories: ["Frontend"],
    tags: ["Blog"],
    content: "## Heading\n\n> quote",
    filePath: "content/posts/post-1/index.md",
  },
];

describe("ReadingOverlay", () => {
  beforeEach(() => {
    useStore.setState({
      mode: "reading",
      activePostId: "post-1",
      isFocusing: false,
      cubeStep: 0,
    });
  });

  it("uses a transparent overlay shell so the 3D scene can remain visible behind reading mode", () => {
    const { container } = render(<ReadingOverlay posts={posts} />);

    expect(screen.getByText("Transparent Overlay")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("bg-[rgba(5,5,16,0.34)]");
  });
});
