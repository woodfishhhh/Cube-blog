import { describe, expect, it } from "vitest";

import { resolveInputIntent } from "@/lib/scene/input-policy";
import {
  createInitialSceneState,
  transitionSceneState,
} from "@/lib/scene/state-machine";

describe("transitionSceneState", () => {
  it("applies a UI home-mode transition without emitting a cube-step effect", () => {
    const result = transitionSceneState(createInitialSceneState(), {
      type: "home-mode-selected",
      origin: "ui",
      target: "home-blog",
    });

    expect(result.state).toMatchObject({
      mode: "home-blog",
      lastHomeMode: "home-blog",
      inputOwner: "none",
    });
    expect(result.effects).toEqual([
      { type: "scene-sync-home-mode", mode: "home-blog" },
    ]);
  });

  it("stores the previous home mode on article entry and restores it on article exit", () => {
    const articleEntry = transitionSceneState(createInitialSceneState("home-author"), {
      type: "article-entered",
      origin: "route",
      slug: "hello-world",
    });

    expect(articleEntry.state).toMatchObject({
      mode: "article-reading",
      lastHomeMode: "home-author",
      inputOwner: "none",
      activeArticleSlug: "hello-world",
    });
    expect(articleEntry.effects).toEqual([
      { type: "content-enter-article", slug: "hello-world" },
    ]);

    const articleExit = transitionSceneState(articleEntry.state, {
      type: "article-exited",
      origin: "route",
    });

    expect(articleExit.state).toMatchObject({
      mode: "home-author",
      lastHomeMode: "home-author",
      inputOwner: "none",
      activeArticleSlug: null,
    });
    expect(articleExit.effects).toEqual([
      { type: "content-exit-article", restoreMode: "home-author" },
    ]);
  });

  it("enters focus, tracks drag ownership, and releases it cleanly", () => {
    const focusEntry = transitionSceneState(createInitialSceneState("home-blog"), {
      type: "cube-focus-entered",
      origin: "scene",
    });

    expect(focusEntry.state).toMatchObject({
      mode: "home-cube-focus",
      lastHomeMode: "home-blog",
      inputOwner: "none",
    });
    expect(focusEntry.effects).toEqual([{ type: "scene-focus-cube" }]);

    const dragStart = transitionSceneState(focusEntry.state, {
      type: "focus-drag-started",
      origin: "scene",
      pointerId: 7,
    });

    expect(dragStart.state).toMatchObject({
      mode: "home-cube-focus",
      lastHomeMode: "home-blog",
      inputOwner: "scene-focus-drag",
      activePointerId: 7,
    });
    expect(dragStart.effects).toEqual([
      { type: "scene-focus-drag-start", pointerId: 7 },
    ]);

    const dragEnd = transitionSceneState(dragStart.state, {
      type: "focus-drag-ended",
      origin: "scene",
      pointerId: 7,
      reason: "pointerup",
    });

    expect(dragEnd.state).toMatchObject({
      mode: "home-cube-focus",
      lastHomeMode: "home-blog",
      inputOwner: "none",
      activePointerId: null,
    });
    expect(dragEnd.effects).toEqual([
      { type: "scene-focus-drag-end", pointerId: 7, reason: "pointerup" },
    ]);
  });

  it("blocks invalid transitions without changing state or emitting effects", () => {
    const state = createInitialSceneState("home-blog");

    const invalidArticleExit = transitionSceneState(state, {
      type: "article-exited",
      origin: "route",
    });

    expect(invalidArticleExit.state).toEqual(state);
    expect(invalidArticleExit.effects).toEqual([]);

    const invalidDragStart = transitionSceneState(state, {
      type: "focus-drag-started",
      origin: "scene",
      pointerId: 9,
    });

    expect(invalidDragStart.state).toEqual(state);
    expect(invalidDragStart.effects).toEqual([]);
  });

  it("moves forward through the home wheel snap sequence", () => {
    const heroToBlog = transitionSceneState(createInitialSceneState("home-hero"), {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "forward",
    });

    expect(heroToBlog.state).toMatchObject({
      mode: "home-blog",
      lastHomeMode: "home-blog",
    });
    expect(heroToBlog.effects).toEqual([
      { type: "scene-wheel-snap", mode: "home-blog", direction: "forward" },
    ]);

    const blogToAuthor = transitionSceneState(heroToBlog.state, {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "forward",
    });

    expect(blogToAuthor.state).toMatchObject({
      mode: "home-author",
      lastHomeMode: "home-author",
    });
    expect(blogToAuthor.effects).toEqual([
      { type: "scene-wheel-snap", mode: "home-author", direction: "forward" },
    ]);
  });

  it("moves backward through the home wheel snap sequence", () => {
    const authorToBlog = transitionSceneState(createInitialSceneState("home-author"), {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "backward",
    });

    expect(authorToBlog.state).toMatchObject({
      mode: "home-blog",
      lastHomeMode: "home-blog",
    });
    expect(authorToBlog.effects).toEqual([
      { type: "scene-wheel-snap", mode: "home-blog", direction: "backward" },
    ]);

    const blogToHero = transitionSceneState(authorToBlog.state, {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "backward",
    });

    expect(blogToHero.state).toMatchObject({
      mode: "home-hero",
      lastHomeMode: "home-hero",
    });
    expect(blogToHero.effects).toEqual([
      { type: "scene-wheel-snap", mode: "home-hero", direction: "backward" },
    ]);
  });
});

describe("resolveInputIntent", () => {
  it("maps UI-originated home clicks to a non-cube-step transition event", () => {
    const decision = resolveInputIntent(createInitialSceneState(), {
      type: "cube-face-click",
      origin: "ui",
      target: "home-blog",
    });

    expect(decision).toEqual({
      allowed: true,
      owner: "ui",
      event: {
        type: "home-mode-selected",
        origin: "ui",
        target: "home-blog",
      },
    });
  });

  it("blocks UI focus clicks so they never emit focus transitions", () => {
    const decision = resolveInputIntent(createInitialSceneState(), {
      type: "cube-focus-click",
      origin: "ui",
    });

    expect(decision).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "ui-cannot-enter-focus",
    });
  });

  it("only allows drag intents while the cube is already focused", () => {
    const blockedDecision = resolveInputIntent(createInitialSceneState(), {
      type: "focus-drag",
      origin: "scene",
      phase: "start",
      pointerId: 3,
    });

    expect(blockedDecision).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "drag-requires-focus",
    });

    const focusState = transitionSceneState(createInitialSceneState(), {
      type: "cube-focus-entered",
      origin: "scene",
    }).state;

    const allowedDecision = resolveInputIntent(focusState, {
      type: "focus-drag",
      origin: "scene",
      phase: "start",
      pointerId: 3,
    });

    expect(allowedDecision).toEqual({
      allowed: true,
      owner: "scene",
      event: {
        type: "focus-drag-started",
        origin: "scene",
        pointerId: 3,
      },
    });
  });

  it("blocks panel scroll handoff before the scroll container reaches a boundary", () => {
    const decision = resolveInputIntent(createInitialSceneState("home-blog"), {
      type: "panel-scroll-wheel",
      origin: "ui",
      direction: "forward",
      boundary: "middle",
    });

    expect(decision).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "panel-scroll-not-at-boundary",
    });
  });

  it("allows panel boundary wheel handoff into a home wheel snap intent", () => {
    const decision = resolveInputIntent(createInitialSceneState("home-blog"), {
      type: "panel-scroll-wheel",
      origin: "ui",
      direction: "forward",
      boundary: "end",
    });

    expect(decision).toEqual({
      allowed: true,
      owner: "ui",
      event: {
        type: "home-wheel-snapped",
        origin: "ui",
        direction: "forward",
      },
    });
  });

  it("blocks homepage wheel and focus intents while an article route is active", () => {
    const articleState = transitionSceneState(createInitialSceneState("home-blog"), {
      type: "article-entered",
      origin: "route",
      slug: "hello-world",
    }).state;

    expect(
      resolveInputIntent(articleState, {
        type: "scene-wheel",
        origin: "scene",
        direction: "forward",
      }),
    ).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "article-reading-locks-home-gestures",
    });

    expect(
      resolveInputIntent(articleState, {
        type: "panel-scroll-wheel",
        origin: "ui",
        direction: "forward",
        boundary: "end",
      }),
    ).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "article-reading-locks-home-gestures",
    });

    expect(
      resolveInputIntent(articleState, {
        type: "cube-focus-click",
        origin: "scene",
      }),
    ).toEqual({
      allowed: false,
      owner: "blocked",
      reason: "article-reading-locks-home-gestures",
    });
  });
});
