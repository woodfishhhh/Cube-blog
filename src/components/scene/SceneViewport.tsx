"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  createSceneEngine,
  type SceneEngine,
} from "@/lib/scene/engine/create-scene-engine";
import { measureSceneHost } from "@/lib/scene/engine/resize";
import { createInitialSceneState } from "@/lib/scene/state-machine";
import type { SceneState } from "@/lib/scene/state-types";

type SceneViewportProps = {
  sceneState?: SceneState;
  engineFactory?: (canvas: HTMLCanvasElement) => SceneEngine;
};

type MeasuredHostSize = {
  width: number;
  height: number;
};

const defaultSceneState = createInitialSceneState();
const defaultEngineFactory = (canvas: HTMLCanvasElement) =>
  createSceneEngine({ canvas });
const minimumHostSize: MeasuredHostSize = { width: 1, height: 1 };

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

export function SceneViewport({
  sceneState = defaultSceneState,
  engineFactory = defaultEngineFactory,
}: SceneViewportProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const latestSceneStateRef = useRef(sceneState);
  const [hostVersion, setHostVersion] = useState(0);
  const [canvasVersion, setCanvasVersion] = useState(0);
  const [hostSize, setHostSize] = useState<MeasuredHostSize>(minimumHostSize);

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

      setHostVersion((version) => version + 1);
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

      setCanvasVersion((version) => version + 1);
    },
    [],
  );

  useEffect(() => {
    latestSceneStateRef.current = sceneState;
    engineRef.current?.applyState(sceneState);
  }, [sceneState]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;

    if (host === null || canvas === null) {
      return;
    }

    const engine = engineFactory(canvas);
    const syncAndResize = (updateMeasuredState: boolean) => {
      const current = syncCurrentCanvas(updateMeasuredState);

      if (current === null) {
        return;
      }

      engine.mount(current.host);
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
      engine.stop();
      engine.dispose();
      engineRef.current = null;
    };
  }, [canvasVersion, engineFactory, hostVersion, syncCurrentCanvas]);

  return (
    <div className="scene-layer" aria-hidden="true" data-layer="scene">
      <div className="scene-layer__ambient" />
      <div className="scene-layer__grid" />
      <div
        ref={handleHostRef}
        className="scene-layer__host"
        data-scene-host="persistent"
        data-scene-mode={sceneState.mode}
        id="scene-host"
      >
        <canvas
          ref={handleCanvasRef}
          aria-hidden="true"
          className="scene-layer__canvas"
          data-scene-canvas="persistent"
          height={hostSize.height}
          style={{ display: "block", height: "100%", width: "100%" }}
          width={hostSize.width}
        />
      </div>
    </div>
  );
}
