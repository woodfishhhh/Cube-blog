import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn<() => string>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

import {
  dispatchHomeSceneIntent,
  getHomeSceneState,
  resetHomeSceneController,
} from "@/components/home/use-home-scene-controller";
import { SceneViewport } from "@/components/scene/SceneViewport";
import { createInitialSceneState, transitionSceneState } from "@/lib/scene/state-machine";
import type { WebGLCapability } from "@/lib/scene/webgl-capability";

function createEngineDouble() {
  return {
    applyState: vi.fn(),
    dispose: vi.fn(),
    hitTestCube: vi.fn(() => false),
    mount: vi.fn(),
    resize: vi.fn(),
    setBudget: vi.fn(),
    setFocusDragOffset: vi.fn(),
    setReducedMotion: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    stepCube: vi.fn(),
  };
}

type MatchMediaChangeListener = (event: MediaQueryListEvent) => void;

function stubReducedMotionQuery(initialMatches: boolean) {
  const listeners = new Set<MatchMediaChangeListener>();
  let matches = initialMatches;

  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: (_event: string, listener: MatchMediaChangeListener) => {
        listeners.add(listener);
      },
      removeEventListener: (_event: string, listener: MatchMediaChangeListener) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
    })),
  );

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;

      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
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

function resolveLiveCapability(): WebGLCapability {
  return {
    isAvailable: true,
    reason: "available",
  };
}

function renderLiveSceneViewport(
  props: Partial<ComponentProps<typeof SceneViewport>> = {},
) {
  return render(
    <SceneViewport
      resolveCapability={resolveLiveCapability}
      {...props}
    />,
  );
}

describe("SceneViewport", () => {
  beforeEach(() => {
    resetHomeSceneController();
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/");
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    await Promise.resolve();
  });

  it("creates one shared engine for the persistent host, wires resize, and disposes after the final unmount", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    const { unmount } = renderLiveSceneViewport({ engineFactory });

    const host = document.getElementById("scene-host");
    const canvas = document.querySelector("canvas[data-scene-canvas='persistent']");

    expect(canvas).not.toBeNull();
    expect(host?.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    expect(engineFactory).toHaveBeenCalledTimes(1);
    expect(engine.mount).toHaveBeenCalledWith(host);
    expect(engine.applyState).toHaveBeenCalledWith(createInitialSceneState());
    expect(engine.start).toHaveBeenCalledTimes(1);
    expect(engine.resize.mock.calls.length).toBeGreaterThanOrEqual(1);

    const resizeCallCountBeforeWindowEvent = engine.resize.mock.calls.length;

    window.dispatchEvent(new Event("resize"));

    expect(engine.resize.mock.calls.length).toBeGreaterThan(resizeCallCountBeforeWindowEvent);

    unmount();

    await waitFor(() => {
      expect(engine.stop).toHaveBeenCalledTimes(1);
      expect(engine.dispose).toHaveBeenCalledTimes(1);
    });
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

    const { rerender } = renderLiveSceneViewport({ engineFactory, sceneState: initialState });

    expect(engineFactory).toHaveBeenCalledTimes(1);
    expect(engine.applyState).toHaveBeenLastCalledWith(initialState);

    rerender(
      <SceneViewport
        engineFactory={engineFactory}
        resolveCapability={resolveLiveCapability}
        sceneState={articleState}
      />,
    );

    expect(engineFactory).toHaveBeenCalledTimes(1);
    expect(engine.applyState).toHaveBeenLastCalledWith(articleState);
    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
  });

  it("reuses the shared engine across an immediate route-like remount", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);
    const firstState = createInitialSceneState("home-hero");
    const secondState = transitionSceneState(firstState, {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "forward",
    }).state;

    const firstRender = renderLiveSceneViewport({ engineFactory, sceneState: firstState });

    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);

    firstRender.unmount();

    expect(engine.dispose).not.toHaveBeenCalled();

    const secondRender = renderLiveSceneViewport({ engineFactory, sceneState: secondState });

    expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    expect(engineFactory).toHaveBeenCalledTimes(1);
    expect(engine.applyState).toHaveBeenLastCalledWith(secondState);

    secondRender.unmount();

    await waitFor(() => {
      expect(engine.stop).toHaveBeenCalledTimes(2);
      expect(engine.dispose).toHaveBeenCalledTimes(1);
    });
  });

  it("recovers when the host loses its canvas asynchronously without a rerender", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    renderLiveSceneViewport({ engineFactory });

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

    renderLiveSceneViewport({ engineFactory });

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

    renderLiveSceneViewport({ engineFactory });

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

  it("enters focus on a cube click, steps on a focused tap, and exits back to the previous home mode on Escape", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-blog",
    });

    renderLiveSceneViewport({ engineFactory });

    const host = document.getElementById("scene-host");

    expect(host).not.toBeNull();

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 7,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 7,
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-cube-focus");
    });

    expect(engine.stepCube).not.toHaveBeenCalled();

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 322,
      clientY: 244,
      pointerId: 8,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 322,
      clientY: 244,
      pointerId: 8,
    });

    await waitFor(() => {
      expect(engine.stepCube).toHaveBeenCalledTimes(1);
    });

    expect(getHomeSceneState().mode).toBe("home-cube-focus");

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-blog");
    });
  });

  it("moves focus onto the exit control when focus mode opens and restores the previous focus on Escape", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-author",
    });

    render(
      <>
        <button type="button">Author trigger</button>
        <button className="cube-focus-hint__close" type="button">
          Exit focus
        </button>
        <SceneViewport engineFactory={engineFactory} resolveCapability={resolveLiveCapability} />
      </>,
    );

    const authorTrigger = screen.getByRole("button", { name: /author trigger/i });
    const exitFocusButton = screen.getByRole("button", { name: /exit focus/i });

    authorTrigger.focus();

    dispatchHomeSceneIntent({
      type: "cube-focus-click",
      origin: "scene",
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-cube-focus");
      expect(exitFocusButton).toHaveFocus();
    });

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-author");
      expect(authorTrigger).toHaveFocus();
    });
  });

  it("restores the last meaningful focused control after pointer-entered focus mode exits", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-author",
    });

    render(
      <>
        <button type="button">Author trigger</button>
        <button className="cube-focus-hint__close" type="button">
          Exit focus
        </button>
        <SceneViewport engineFactory={engineFactory} resolveCapability={resolveLiveCapability} />
      </>,
    );

    const authorTrigger = screen.getByRole("button", { name: /author trigger/i });
    const exitFocusButton = screen.getByRole("button", { name: /exit focus/i });
    const host = document.getElementById("scene-host");

    expect(host).not.toBeNull();

    authorTrigger.focus();
    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 19,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 320,
      clientY: 240,
      pointerId: 19,
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-cube-focus");
      expect(exitFocusButton).toHaveFocus();
    });

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-author");
      expect(authorTrigger).toHaveFocus();
    });
  });

  it("starts focus drag only after the deterministic threshold and resets the camera offset on pointerup", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    renderLiveSceneViewport({ engineFactory });

    const host = document.getElementById("scene-host");

    expect(host).not.toBeNull();

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 300,
      clientY: 200,
      pointerId: 11,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 300,
      clientY: 200,
      pointerId: 11,
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-cube-focus");
    });

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 240,
      clientY: 220,
      pointerId: 12,
    });

    const offsetCallCountBeforeThreshold = engine.setFocusDragOffset.mock.calls.length;

    fireEvent.pointerMove(host as HTMLElement, {
      clientX: 244,
      clientY: 223,
      pointerId: 12,
    });

    expect(getHomeSceneState().inputOwner).toBe("none");
    expect(engine.setFocusDragOffset.mock.calls.length).toBe(offsetCallCountBeforeThreshold);

    fireEvent.pointerMove(host as HTMLElement, {
      clientX: 292,
      clientY: 264,
      pointerId: 12,
    });

    await waitFor(() => {
      expect(getHomeSceneState().inputOwner).toBe("scene-focus-drag");
    });

    expect(engine.setFocusDragOffset).toHaveBeenCalledWith(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      }),
    );

    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 292,
      clientY: 264,
      pointerId: 12,
    });

    await waitFor(() => {
      expect(getHomeSceneState().inputOwner).toBe("none");
    });

    expect(engine.setFocusDragOffset).toHaveBeenLastCalledWith({ x: 0, y: 0 });
  });

  it("steps the cube on background taps outside focus without changing the home mode", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-author",
    });

    renderLiveSceneViewport({ engineFactory });

    const host = document.getElementById("scene-host");

    expect(host).not.toBeNull();

    engine.hitTestCube.mockReturnValue(false);

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 120,
      clientY: 180,
      pointerId: 13,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 120,
      clientY: 180,
      pointerId: 13,
    });

    await waitFor(() => {
      expect(engine.stepCube).toHaveBeenCalledTimes(1);
    });

    expect(getHomeSceneState().mode).toBe("home-author");
  });

  it("ignores scene taps during article-reading and restores them after leaving the article route", async () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target: "home-blog",
    });

    renderLiveSceneViewport({ engineFactory });

    const host = document.getElementById("scene-host");

    expect(host).not.toBeNull();

    dispatchHomeSceneIntent({
      type: "article-route-change",
      origin: "route",
      phase: "enter",
      slug: "hello-world",
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("article-reading");
    });

    engine.hitTestCube.mockReturnValue(true);

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 260,
      clientY: 210,
      pointerId: 14,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 260,
      clientY: 210,
      pointerId: 14,
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("article-reading");
    });

    expect(engine.stepCube).not.toHaveBeenCalled();

    dispatchHomeSceneIntent({
      type: "article-route-change",
      origin: "route",
      phase: "exit",
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-blog");
    });

    fireEvent.pointerDown(host as HTMLElement, {
      clientX: 260,
      clientY: 210,
      pointerId: 15,
    });
    fireEvent.pointerUp(host as HTMLElement, {
      clientX: 260,
      clientY: 210,
      pointerId: 15,
    });

    await waitFor(() => {
      expect(getHomeSceneState().mode).toBe("home-cube-focus");
    });
  });

  it("renders a static backdrop and skips engine startup when WebGL capability is unavailable", () => {
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    render(
      <SceneViewport
        engineFactory={engineFactory}
        resolveCapability={() => ({
          isAvailable: false,
          reason: "webgl-context-unavailable",
        })}
      />,
    );

    expect(screen.getByTestId("scene-static-backdrop")).toBeInTheDocument();
    expect(document.querySelector("canvas[data-scene-canvas='persistent']")).toBeNull();
    expect(engineFactory).not.toHaveBeenCalled();
    expect(engine.start).not.toHaveBeenCalled();
  });

  it("short-circuits live scene startup on direct article-route loads", () => {
    mockUsePathname.mockReturnValue("/posts/hello-world");

    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    renderLiveSceneViewport({ engineFactory });

    expect(screen.getByTestId("scene-static-backdrop")).toBeInTheDocument();
    expect(document.querySelector("canvas[data-scene-canvas='persistent']")).toBeNull();
    expect(engineFactory).not.toHaveBeenCalled();
    expect(engine.start).not.toHaveBeenCalled();
  });

  it("activates the live scene after article-first loads navigate back home", async () => {
    mockUsePathname.mockReturnValue("/posts/hello-world");

    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);
    const view = renderLiveSceneViewport({ engineFactory });

    expect(screen.getByTestId("scene-static-backdrop")).toBeInTheDocument();
    expect(engineFactory).not.toHaveBeenCalled();

    mockUsePathname.mockReturnValue("/");
    view.rerender(
      <SceneViewport
        engineFactory={engineFactory}
        resolveCapability={resolveLiveCapability}
      />,
    );

    await waitFor(() => {
      expect(engineFactory).toHaveBeenCalledTimes(1);
      expect(engine.start).toHaveBeenCalledTimes(1);
      expect(document.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);
    });
  });

  it("passes the reduced-motion preference through the viewport boundary into the live scene engine", async () => {
    const reducedMotion = stubReducedMotionQuery(true);
    const engine = createEngineDouble();
    const engineFactory = vi.fn(() => engine);

    renderLiveSceneViewport({ engineFactory });

    await waitFor(() => {
      expect(engine.setReducedMotion).toHaveBeenCalledWith(true);
    });

    reducedMotion.setMatches(false);

    await waitFor(() => {
      expect(engine.setReducedMotion).toHaveBeenLastCalledWith(false);
    });
  });

  it("exposes desktop-home budget markers on the persistent scene host", () => {
    const engine = createEngineDouble();

    renderLiveSceneViewport({ engineFactory: vi.fn(() => engine) });

    const host = document.getElementById("scene-host");

    expect(host).toHaveAttribute("data-scene-budget-state", "home");
    expect(host).toHaveAttribute("data-scene-budget-tier", "desktop-default");
    expect(host).toHaveAttribute("data-scene-budget-starfield-count", "160");
    expect(host).toHaveAttribute("data-scene-budget-camera-ambient-motion-scale", "1");
    expect(host).toHaveAttribute("data-scene-budget-camera-parallax-scale", "1");
    expect(host).toHaveAttribute("data-scene-budget-cube-ambient-motion-scale", "1");
  });

  it("switches the host budget markers to the mobile tier when the touch-static layout is active", () => {
    const engine = createEngineDouble();
    const mobileMarker = document.createElement("div");

    mobileMarker.dataset.homeInteractionMode = "touch-static";
    document.body.append(mobileMarker);

    renderLiveSceneViewport({ engineFactory: vi.fn(() => engine) });

    const host = document.getElementById("scene-host");

    expect(host).toHaveAttribute("data-scene-budget-state", "home");
    expect(host).toHaveAttribute("data-scene-budget-tier", "mobile");
    expect(host).toHaveAttribute("data-scene-budget-starfield-count", "72");
    expect(host).toHaveAttribute("data-scene-renderer", "live");
  });

  it("switches the host budget markers to the reduced-motion tier when motion is reduced", async () => {
    const engine = createEngineDouble();

    stubReducedMotionQuery(true);

    renderLiveSceneViewport({ engineFactory: vi.fn(() => engine) });

    await waitFor(() => {
      const host = document.getElementById("scene-host");

      expect(host).toHaveAttribute("data-scene-budget-state", "home");
      expect(host).toHaveAttribute("data-scene-budget-tier", "reduced-motion");
      expect(host).toHaveAttribute("data-scene-budget-starfield-count", "96");
      expect(host).toHaveAttribute("data-scene-motion", "reduced");
    });
  });

  it("exposes disabled budget markers on deferred article loads", () => {
    mockUsePathname.mockReturnValue("/posts/hello-world");

    const engine = createEngineDouble();

    renderLiveSceneViewport({ engineFactory: vi.fn(() => engine) });

    const host = document.getElementById("scene-host");

    expect(host).toHaveAttribute("data-scene-renderer", "deferred");
    expect(host).toHaveAttribute("data-scene-budget-state", "disabled");
    expect(host).toHaveAttribute("data-scene-budget-tier", "disabled");
    expect(host).toHaveAttribute("data-scene-budget-starfield-count", "0");
    expect(host).toHaveAttribute("data-scene-budget-camera-ambient-motion-scale", "0");
    expect(host).toHaveAttribute("data-scene-budget-camera-parallax-scale", "0");
    expect(host).toHaveAttribute("data-scene-budget-cube-ambient-motion-scale", "0");
  });
});
