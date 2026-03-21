import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SceneViewport } from "@/components/scene/SceneViewport";
import { createInitialSceneState, transitionSceneState } from "@/lib/scene/state-machine";

function createEngineDouble() {
  return {
    mount: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    resize: vi.fn(),
    applyState: vi.fn(),
    dispose: vi.fn(),
  };
}

function setHostSize(host: HTMLElement, width: number, height: number) {
  Object.defineProperty(host, "clientWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(host, "clientHeight", {
    configurable: true,
    value: height,
  });
}

describe("SceneViewport", () => {
  it("creates one engine for the persistent host canvas, wires resize, and cleans up on unmount", () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    const { unmount } = render(<SceneViewport engineFactory={engineFactory} />);

    const host = document.getElementById("scene-host");
    const canvas = document.querySelector("canvas[data-scene-canvas='persistent']");

    expect(canvas).not.toBeNull();
    expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    expect(engineFactory).toHaveBeenCalledWith(canvas);
    expect(engine.mount).toHaveBeenCalledWith(host);
    expect(engine.applyState).toHaveBeenCalledWith(createInitialSceneState());
    expect(engine.start).toHaveBeenCalledTimes(2);
    expect(engine.resize.mock.calls.length).toBeGreaterThanOrEqual(2);

    const resizeCallCountBeforeWindowEvent = engine.resize.mock.calls.length;

    window.dispatchEvent(new Event("resize"));

    expect(engine.resize.mock.calls.length).toBeGreaterThan(resizeCallCountBeforeWindowEvent);

    unmount();

    expect(engine.stop).toHaveBeenCalledTimes(2);
    expect(engine.dispose).toHaveBeenCalledTimes(2);
  });

  it("applies updated Task 5 scene state without recreating the engine", () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);
    const initialState = createInitialSceneState("home-blog");
    const articleState = transitionSceneState(initialState, {
      type: "article-entered",
      origin: "route",
      slug: "demo-post",
    }).state;

    const { rerender } = render(
      <SceneViewport engineFactory={engineFactory} sceneState={initialState} />,
    );

    expect(engineFactory).toHaveBeenCalledTimes(2);
    expect(engine.applyState).toHaveBeenLastCalledWith(initialState);

    rerender(
      <SceneViewport engineFactory={engineFactory} sceneState={articleState} />,
    );

    expect(engineFactory).toHaveBeenCalledTimes(2);
    expect(engine.applyState).toHaveBeenLastCalledWith(articleState);
    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
  });

  it("keeps exactly one persistent canvas attached across a route-like rerender", () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);
    const firstState = createInitialSceneState("home-hero");
    const secondState = transitionSceneState(firstState, {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "forward",
    }).state;

    const { rerender } = render(
      <SceneViewport engineFactory={engineFactory} sceneState={firstState} />,
    );

    rerender(
      <SceneViewport engineFactory={engineFactory} sceneState={secondState} />,
    );

    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    expect(engineFactory).toHaveBeenCalledTimes(2);
  });

  it("recovers when the host loses its canvas asynchronously without a rerender", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    render(<SceneViewport engineFactory={engineFactory} />);

    const host = document.getElementById("scene-host");

    expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);

    host?.replaceChildren();

    expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(0);

    await waitFor(() => {
      expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    });
  });

  it("recovers the persistent canvas on browser history events", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    render(<SceneViewport engineFactory={engineFactory} />);

    const host = document.getElementById("scene-host");

    host?.replaceChildren();
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() => {
      expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    });
  });

  it("updates the visible canvas size when the host box changes after mount", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);
    const resizeObserverCallbacks: ResizeObserverCallback[] = [];
    const originalResizeObserver = globalThis.ResizeObserver;

    class MockResizeObserver {
      observe = vi.fn();

      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallbacks.push(callback);
      }

      disconnect() {}

      unobserve() {}
    }

    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    render(<SceneViewport engineFactory={engineFactory} />);

    const host = document.getElementById("scene-host");
    const canvas = document.querySelector("canvas[data-scene-canvas='persistent']") as HTMLCanvasElement | null;
    const resizeObserverCallback = resizeObserverCallbacks.at(-1);

    expect(host).not.toBeNull();
    expect(canvas).not.toBeNull();
    expect(resizeObserverCallbacks.length).toBeGreaterThanOrEqual(1);
    expect(resizeObserverCallback).toBeDefined();

    setHostSize(host as HTMLElement, 885, 700);

    resizeObserverCallback?.([] as ResizeObserverEntry[], {} as ResizeObserver);

    await waitFor(() => {
      expect(canvas?.width).toBe(885);
      expect(canvas?.height).toBe(700);
    });

    if (originalResizeObserver === undefined) {
      vi.unstubAllGlobals();
    } else {
      globalThis.ResizeObserver = originalResizeObserver;
    }
  });
});
