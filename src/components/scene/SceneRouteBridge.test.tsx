import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  dispatchHomeSceneIntent,
  getHomeSceneState,
  resetHomeSceneController,
} from "@/components/home/use-home-scene-controller";
import { SceneRouteBridge } from "@/components/scene/SceneRouteBridge";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn<() => string>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("SceneRouteBridge", () => {
  beforeEach(() => {
    resetHomeSceneController();
    mockUsePathname.mockReset();
  });

  it("enters article-reading when the pathname resolves to /posts/[slug]", async () => {
    mockUsePathname.mockReturnValue("/posts/hello-world");

    render(<SceneRouteBridge />);

    await waitFor(() => {
      expect(getHomeSceneState()).toMatchObject({
        mode: "article-reading",
        activeArticleSlug: "hello-world",
      });
    });
  });

  it("restores the prior home mode when navigation leaves an article route", async () => {
    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-author",
    });

    mockUsePathname.mockReturnValue("/posts/hello-world");

    const view = render(<SceneRouteBridge />);

    await waitFor(() => {
      expect(getHomeSceneState()).toMatchObject({
        mode: "article-reading",
        lastHomeMode: "home-author",
        activeArticleSlug: "hello-world",
      });
    });

    mockUsePathname.mockReturnValue("/");
    view.rerender(<SceneRouteBridge />);

    await waitFor(() => {
      expect(getHomeSceneState()).toMatchObject({
        mode: "home-author",
        lastHomeMode: "home-author",
        activeArticleSlug: null,
      });
    });
  });

  it("updates the active article slug when navigating between article routes", async () => {
    mockUsePathname.mockReturnValue("/posts/first-post");

    const view = render(<SceneRouteBridge />);

    await waitFor(() => {
      expect(getHomeSceneState()).toMatchObject({
        mode: "article-reading",
        activeArticleSlug: "first-post",
      });
    });

    mockUsePathname.mockReturnValue("/posts/second-post");
    view.rerender(<SceneRouteBridge />);

    await waitFor(() => {
      expect(getHomeSceneState()).toMatchObject({
        mode: "article-reading",
        activeArticleSlug: "second-post",
      });
    });
  });
});
