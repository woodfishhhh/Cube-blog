"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import {
  dispatchHomeSceneIntent,
  subscribeHomeSceneEffects,
  useHomeSceneState,
} from "@/components/home/use-home-scene-controller";
import {
  resolveSceneBudget,
  resolveSceneBudgetState,
  resolveSceneBudgetTier,
} from "@/lib/scene/budgets";
import {
  createSceneEngine,
  type SceneEngine,
} from "@/lib/scene/engine/create-scene-engine";
import { resolveSceneRouteMode } from "@/lib/scene/route-mode";
import { measureSceneHost } from "@/lib/scene/engine/resize";
import { resolveSceneHomeDisplayMode } from "@/lib/scene/modules/cube-step";
import { createFocusControls, type FocusControls } from "@/lib/scene/modules/focus-controls";
import { createInitialSceneState } from "@/lib/scene/state-machine";
import type { SceneState } from "@/lib/scene/state-types";
import {
  resolveWebGLCapability,
  type WebGLCapability,
} from "@/lib/scene/webgl-capability";

import { StaticBackdrop } from "@/components/scene/StaticBackdrop";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SceneViewportProps = {
  sceneState?: SceneState;
  engineFactory?: (canvas: HTMLCanvasElement) => SceneEngine;
  resolveCapability?: () => WebGLCapability;
};

type SceneEngineFactory = NonNullable<SceneViewportProps["engineFactory"]>;

type SharedSceneEngineLease = {
  activeMounts: number;
  engine: SceneEngine | null;
  engineFactory: SceneEngineFactory | null;
  releaseVersion: number;
};

type MeasuredHostSize = {
  width: number;
  height: number;
};

const defaultSceneState = createInitialSceneState();
const defaultEngineFactory = (canvas: HTMLCanvasElement) =>
  createSceneEngine({ canvas });
const minimumHostSize: MeasuredHostSize = { width: 1, height: 1 };
const sharedSceneEngineLease: SharedSceneEngineLease = {
  activeMounts: 0,
  engine: null,
  engineFactory: null,
  releaseVersion: 0,
};
const hardSceneInteractionBlockSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[data-home-scroll-panel='true']",
  "[data-scene-interaction-block='true']",
  ".shell-nav",
].join(", ");
const cubeHitPassThroughSelector = [".home-hero"].join(", ");

type SceneInteractionTargetPolicy = "allow" | "block" | "cube-hit-only";

function resolveTargetElement(target: EventTarget | null) {
  if (target instanceof Element) {
    return target;
  }

  return target instanceof Node ? target.parentElement : null;
}

function hasTouchStaticHomeLayout() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.querySelector("[data-home-interaction-mode='touch-static']") !== null;
}

function resolveSceneInteractionTargetPolicy(target: EventTarget | null): SceneInteractionTargetPolicy {
  if (hasTouchStaticHomeLayout()) {
    return "block";
  }

  const targetElement = resolveTargetElement(target);

  if (targetElement === null) {
    return "allow";
  }

  if (targetElement.closest(hardSceneInteractionBlockSelector) !== null) {
    return "block";
  }

  if (targetElement.closest(cubeHitPassThroughSelector) !== null) {
    return "cube-hit-only";
  }

  return "allow";
}

function acquireSharedSceneEngine(
  engineFactory: SceneEngineFactory,
  canvas: HTMLCanvasElement,
) {
  sharedSceneEngineLease.releaseVersion += 1;

  if (
    sharedSceneEngineLease.engine === null ||
    sharedSceneEngineLease.engineFactory !== engineFactory
  ) {
    sharedSceneEngineLease.engine?.stop();
    sharedSceneEngineLease.engine?.dispose();
    sharedSceneEngineLease.engine = engineFactory(canvas);
    sharedSceneEngineLease.engineFactory = engineFactory;
  }

  sharedSceneEngineLease.activeMounts += 1;

  return sharedSceneEngineLease.engine;
}

function releaseSharedSceneEngine(engine: SceneEngine) {
  sharedSceneEngineLease.activeMounts = Math.max(
    0,
    sharedSceneEngineLease.activeMounts - 1,
  );
  sharedSceneEngineLease.releaseVersion += 1;

  const releaseVersion = sharedSceneEngineLease.releaseVersion;

  engine.stop();

  queueMicrotask(() => {
    if (
      sharedSceneEngineLease.engine !== engine ||
      sharedSceneEngineLease.activeMounts > 0 ||
      sharedSceneEngineLease.releaseVersion !== releaseVersion
    ) {
      return;
    }

    engine.dispose();
    sharedSceneEngineLease.engine = null;
    sharedSceneEngineLease.engineFactory = null;
  });
}

function getCurrentSceneHost() {
  return document.getElementById("scene-host") as HTMLDivElement | null;
}

function getCurrentSceneCanvas() {
  return document.querySelector(
    "canvas[data-scene-canvas='persistent']",
  ) as HTMLCanvasElement | null;
}

function setCanvasDrawingBufferSize(
  canvas: HTMLCanvasElement,
  size: MeasuredHostSize,
) {
  canvas.width = size.width;
  canvas.height = size.height;
}

function isRestorableFocusTarget(element: HTMLElement | null) {
  if (element === null || element === document.body || element === document.documentElement) {
    return false;
  }

  return !element.closest(".cube-focus-hint");
}

export function SceneViewport({
  sceneState,
  engineFactory = defaultEngineFactory,
  resolveCapability,
}: SceneViewportProps) {
  const pathname = usePathname();
  const sharedSceneState = useHomeSceneState();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const focusControlsRef = useRef<FocusControls | null>(null);
  const resolvedSceneState = sceneState ?? sharedSceneState ?? defaultSceneState;
  const lastFocusModeRef = useRef(resolvedSceneState.mode);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const latestSceneStateRef = useRef(resolvedSceneState);
  const [hostSize, setHostSize] = useState<MeasuredHostSize>(minimumHostSize);
  const prefersReducedMotion = useReducedMotion();
  const routeMode = resolveSceneRouteMode(pathname ?? "/");
  const sceneSetupBudget = resolveSceneBudget({
    reducedMotion: prefersReducedMotion,
    sceneEnabled: routeMode.kind === "home",
    sceneMode: resolvedSceneState.mode,
    touchLayout: hasTouchStaticHomeLayout(),
  });
  const sceneSetupEnabled = sceneSetupBudget.starfieldCount > 0;
  const capability = useMemo<WebGLCapability | null>(
    () =>
      sceneSetupEnabled ? (resolveCapability?.() ?? resolveWebGLCapability()) : null,
    [resolveCapability, sceneSetupEnabled],
  );
  const interactionsEnabled = sceneState === undefined;
  const sceneBudgetState =
    routeMode.kind === "home" ? resolveSceneBudgetState(resolvedSceneState.mode) : "disabled";
  const sceneBudgetTier =
    routeMode.kind === "home"
      ? resolveSceneBudgetTier({
          reducedMotion: prefersReducedMotion,
          touchLayout: hasTouchStaticHomeLayout(),
        })
      : "disabled";
  const rendersLiveScene = sceneSetupEnabled && capability?.isAvailable === true;
  const sceneRenderer = rendersLiveScene
    ? "live"
    : sceneSetupEnabled
      ? "fallback"
      : "deferred";

  const commitHostSize = useCallback((size: MeasuredHostSize) => {
    setHostSize((currentSize) => {
      if (currentSize.width === size.width && currentSize.height === size.height) {
        return currentSize;
      }

      return size;
    });
  }, []);

  const syncCurrentCanvas = useCallback(
    (updateMeasuredState: boolean) => {
      const host = getCurrentSceneHost() ?? hostRef.current;
      const canvas = getCurrentSceneCanvas() ?? canvasRef.current;

      if (host === null || canvas === null) {
        return null;
      }

      const size = measureSceneHost(host, window);

      setCanvasDrawingBufferSize(canvas, size);

      if (updateMeasuredState) {
        commitHostSize(size);
      }

      return { canvas, host, size };
    },
    [commitHostSize],
  );

  const handleHostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (hostRef.current === node) {
        return;
      }

      hostRef.current = node;

      if (node !== null) {
        commitHostSize(measureSceneHost(node, window));
      }
    },
    [commitHostSize],
  );

  const handleCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (canvasRef.current === node) {
        return;
      }

      canvasRef.current = node;

      if (node !== null) {
        const host = getCurrentSceneHost() ?? hostRef.current;

        if (host !== null) {
          setCanvasDrawingBufferSize(node, measureSceneHost(host, window));
        }
      }
    },
    [],
  );

  useEffect(() => {
    engineRef.current?.setBudget(sceneSetupBudget);
    latestSceneStateRef.current = resolvedSceneState;
    engineRef.current?.applyState(resolvedSceneState);
    focusControlsRef.current?.syncSceneState(resolvedSceneState);
  }, [resolvedSceneState, sceneSetupBudget]);

  useEffect(() => {
    const previousMode = lastFocusModeRef.current;
    const nextMode = resolvedSceneState.mode;

    if (previousMode === nextMode) {
      return;
    }

    if (nextMode === "home-cube-focus") {
      document.querySelector<HTMLButtonElement>("button.cube-focus-hint__close")?.focus();
    } else if (previousMode === "home-cube-focus") {
      const previousFocusedElement = previousFocusedElementRef.current;

      previousFocusedElementRef.current = null;

      if (previousFocusedElement?.isConnected) {
        previousFocusedElement.focus();
      }
    }

    lastFocusModeRef.current = nextMode;
  }, [resolvedSceneState.mode]);

  useEffect(() => {
    const handleFocusIn = () => {
      if (latestSceneStateRef.current.mode === "home-cube-focus") {
        return;
      }

      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!isRestorableFocusTarget(activeElement)) {
        return;
      }

      previousFocusedElementRef.current = activeElement;
    };

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setReducedMotion(prefersReducedMotion);
    engineRef.current?.setBudget(sceneSetupBudget);

    const host = hostRef.current;
    const canvas = canvasRef.current;
    const motionMode = prefersReducedMotion ? "reduced" : "full";

    if (host !== null) {
      host.dataset.sceneMotion = motionMode;
    }

    if (canvas !== null) {
      canvas.dataset.sceneMotion = motionMode;
    }
  }, [prefersReducedMotion, sceneSetupBudget]);

  useEffect(() => {
    return subscribeHomeSceneEffects((effect) => {
      if (effect.type === "scene-wheel-snap" || effect.type === "scene-cube-step") {
        engineRef.current?.stepCube();
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (!rendersLiveScene) {
      return;
    }

    const host = hostRef.current;
    const canvas = canvasRef.current;

    if (host === null || canvas === null) {
      return;
    }

    const engine = acquireSharedSceneEngine(engineFactory, canvas);
    const syncAndResize = (updateMeasuredState: boolean) => {
      const current = syncCurrentCanvas(updateMeasuredState);

      if (current === null) {
        return;
      }

      engine.mount(current.host);
      engine.setReducedMotion(prefersReducedMotion);
      engine.setBudget(sceneSetupBudget);
      engine.applyState(latestSceneStateRef.current);
      engine.resize();
    };
    const recoverCanvasAttachment = () => {
      const current = syncCurrentCanvas(true);

      if (current === null) {
        return;
      }

      if (current.canvas.parentElement !== current.host) {
        current.host.append(current.canvas);
      }

      engine.mount(current.host);
      engine.setReducedMotion(prefersReducedMotion);
      engine.setBudget(sceneSetupBudget);
      engine.applyState(latestSceneStateRef.current);
      engine.resize();
    };
    const handleWindowResize = () => {
      syncAndResize(true);
    };
    const handleBrowserRestore = () => {
      window.setTimeout(recoverCanvasAttachment, 0);
    };
    const hostObserver = new MutationObserver(() => {
      recoverCanvasAttachment();
    });
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            syncAndResize(true);
          });

    engineRef.current = engine;
    focusControlsRef.current?.dispose();
    focusControlsRef.current = null;

    if (interactionsEnabled) {
      focusControlsRef.current = createFocusControls({
        getSceneState: () => latestSceneStateRef.current,
        hitTestCube: (clientX, clientY) => engine.hitTestCube(clientX, clientY),
        getTargetPolicy: resolveSceneInteractionTargetPolicy,
        onEndFocusDrag(pointerId, reason) {
          dispatchHomeSceneIntent({
            type: "focus-drag",
            origin: "scene",
            phase: reason === "pointerup" ? "end" : "cancel",
            pointerId,
          });
        },
        onEnterFocus() {
          dispatchHomeSceneIntent({
            type: "cube-focus-click",
            origin: "scene",
          });
        },
        onExitFocus() {
          const state = latestSceneStateRef.current;

          if (state.mode !== "home-cube-focus") {
            return;
          }

          dispatchHomeSceneIntent({
            type: "home-nav-click",
            origin: "ui",
            target: resolveSceneHomeDisplayMode(state),
          });
        },
        onStartFocusDrag(pointerId) {
          dispatchHomeSceneIntent({
            type: "focus-drag",
            origin: "scene",
            phase: "start",
            pointerId,
          });
        },
        onStepCube() {
          engine.stepCube();
        },
        setFocusDragOffset(offset) {
          engine.setFocusDragOffset(offset);
        },
        viewportElement: host,
      });
      focusControlsRef.current.syncSceneState(latestSceneStateRef.current);
    }

    syncAndResize(false);
    engine.start();
    hostObserver.observe(host, { childList: true });
    resizeObserver?.observe(host);
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("pageshow", handleBrowserRestore);
    window.addEventListener("popstate", handleBrowserRestore);

    return () => {
      hostObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("pageshow", handleBrowserRestore);
      window.removeEventListener("popstate", handleBrowserRestore);

      if (engineRef.current === engine) {
        engineRef.current = null;
      }

      focusControlsRef.current?.dispose();
      focusControlsRef.current = null;

      releaseSharedSceneEngine(engine);
    };
  }, [
    engineFactory,
    interactionsEnabled,
    prefersReducedMotion,
    rendersLiveScene,
    sceneSetupBudget,
    syncCurrentCanvas,
  ]);

  useEffect(() => {
    return () => {
      engineRef.current = null;
      previousFocusedElementRef.current = null;
    };
  }, []);

  return (
    <div
      className="scene-layer"
      aria-hidden="true"
      data-layer="scene"
      data-scene-motion={prefersReducedMotion ? "reduced" : "full"}
    >
      <div className="scene-layer__ambient" />
      <div className="scene-layer__grid" />
      <div
        ref={rendersLiveScene ? handleHostRef : undefined}
        className="scene-layer__host"
        data-scene-budget-camera-ambient-motion-scale={sceneSetupBudget.cameraAmbientMotionScale}
        data-scene-budget-camera-parallax-scale={sceneSetupBudget.cameraParallaxScale}
        data-scene-budget-cube-ambient-motion-scale={sceneSetupBudget.cubeAmbientMotionScale}
        data-scene-budget-starfield-count={sceneSetupBudget.starfieldCount}
        data-scene-budget-state={sceneBudgetState}
        data-scene-budget-tier={sceneBudgetTier}
        data-scene-host="persistent"
        data-scene-input-owner={resolvedSceneState.inputOwner}
        data-scene-active-pointer={resolvedSceneState.activePointerId ?? "none"}
        data-scene-mode={resolvedSceneState.mode}
        data-scene-motion={prefersReducedMotion ? "reduced" : "full"}
        data-scene-renderer={sceneRenderer}
        id="scene-host"
      >
        {rendersLiveScene ? (
          <canvas
            ref={handleCanvasRef}
            className="scene-layer__canvas"
            data-scene-budget-camera-ambient-motion-scale={sceneSetupBudget.cameraAmbientMotionScale}
            data-scene-budget-camera-parallax-scale={sceneSetupBudget.cameraParallaxScale}
            data-scene-budget-cube-ambient-motion-scale={sceneSetupBudget.cubeAmbientMotionScale}
            data-scene-canvas="persistent"
            data-scene-budget-starfield-count={sceneSetupBudget.starfieldCount}
            data-scene-budget-state={sceneBudgetState}
            data-scene-budget-tier={sceneBudgetTier}
            height={hostSize.height}
            style={{ display: "block", height: "100%", width: "100%" }}
            width={hostSize.width}
          />
        ) : (
          <StaticBackdrop reason={capability?.reason} />
        )}
      </div>
    </div>
  );
}
