import { describe, expect, it } from "vitest";

import { createInitialSceneState } from "@/lib/scene/state-machine";
import {
  resolveHomeSceneRestoreMode,
  resolveSceneRouteMode,
} from "@/lib/scene/route-mode";

describe("resolveSceneRouteMode", () => {
  it("treats /posts/[slug] pathnames as article-reading routes", () => {
    expect(resolveSceneRouteMode("/posts/hello-world")).toEqual({
      kind: "article",
      slug: "hello-world",
    });
  });

  it("normalizes a trailing slash on article routes", () => {
    expect(resolveSceneRouteMode("/posts/hello-world/")).toEqual({
      kind: "article",
      slug: "hello-world",
    });
  });

  it("treats non-article pathnames as homepage mode", () => {
    expect(resolveSceneRouteMode("/")).toEqual({ kind: "home" });
    expect(resolveSceneRouteMode("/posts")).toEqual({ kind: "home" });
    expect(resolveSceneRouteMode("/posts/hello-world/comments")).toEqual({ kind: "home" });
  });
});

describe("resolveHomeSceneRestoreMode", () => {
  it("keeps the current home display mode when already on a home route", () => {
    expect(resolveHomeSceneRestoreMode(createInitialSceneState("home-blog"))).toBe("home-blog");
  });

  it("restores the previous home mode after article reading", () => {
    expect(
      resolveHomeSceneRestoreMode({
        mode: "article-reading",
        lastHomeMode: "home-author",
      }),
    ).toBe("home-author");
  });

  it("restores the previous home mode after cube focus", () => {
    expect(
      resolveHomeSceneRestoreMode({
        mode: "home-cube-focus",
        lastHomeMode: "home-blog",
      }),
    ).toBe("home-blog");
  });

  it("falls back to hero if a restore candidate is still cube focus", () => {
    expect(
      resolveHomeSceneRestoreMode({
        mode: "article-reading",
        lastHomeMode: "home-cube-focus",
      }),
    ).toBe("home-hero");
  });
});
