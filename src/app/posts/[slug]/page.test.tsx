import type { ReactElement } from "react";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PostNotFoundPage from "@/app/posts/[slug]/not-found";
import PostPage, { dynamicParams, generateStaticParams } from "@/app/posts/[slug]/page";
import { getArticleStaticParams } from "@/lib/content/article-data";

describe("PostPage", () => {
  it("renders a known article route inside the centered document page shell", async () => {
    const [params] = getArticleStaticParams();
    const page = await PostPage({ params: Promise.resolve(params) });

    render(page as ReactElement);

    const main = screen.getByRole("main");

    expect(main).toHaveClass("article-page");
    expect(main.querySelector(".article-view")).not.toBeNull();
    expect(within(main).getByRole("article")).toHaveClass("article-view");
    expect(within(main).getByText("Published")).toBeInTheDocument();
    expect(within(main).getByText("Category")).toBeInTheDocument();
    expect(within(main).getByText("Tags")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps unknown slugs eligible for the custom article-style fallback shell", async () => {
    expect(await generateStaticParams()).toEqual(getArticleStaticParams());

    render(<PostNotFoundPage />);

    expect(dynamicParams).not.toBe(false);
    expect(screen.getByRole("heading", { name: /article not found/i })).toBeInTheDocument();
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("/posts/[slug]")).toBeInTheDocument();
  });

  it("throws the Next 404 boundary for unknown slugs", async () => {
    await expect(
      PostPage({
        params: Promise.resolve({ slug: "not-a-real-post" }),
      }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });
});
