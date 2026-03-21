import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { Object3D } from "three";

import { disposeSceneResources } from "@/lib/scene/engine/dispose";
import { measureSceneHost, resizeSceneRenderer } from "@/lib/scene/engine/resize";
import type { SceneState } from "@/lib/scene/state-types";

type RendererLike = Pick<
  WebGLRenderer,
  "dispose" | "domElement" | "render" | "setPixelRatio" | "setSize"
>;
type CameraLike = Pick<
  PerspectiveCamera,
  "aspect" | "position" | "updateProjectionMatrix"
>;
type SceneLike = Pick<Object3D, "traverse">;

type CreateSceneEngineOptions = {
  canvas?: HTMLCanvasElement;
  cancelAnimationFrame?: typeof window.cancelAnimationFrame;
  createCamera?: () => CameraLike;
  createRenderer?: (canvas?: HTMLCanvasElement) => RendererLike;
  createScene?: () => SceneLike;
  requestAnimationFrame?: typeof window.requestAnimationFrame;
  viewport?: Pick<Window, "devicePixelRatio" | "innerHeight" | "innerWidth">;
};

export type SceneEngine = {
  applyState: (state: SceneState) => void;
  dispose: () => void;
  mount: (host: HTMLElement) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
};

function createDefaultRenderer(canvas?: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance",
  });

  renderer.domElement.dataset.sceneCanvas = "persistent";
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.display = "block";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.width = "100%";

  return renderer;
}

function createDefaultCamera() {
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);

  camera.position.z = 6;

  return camera;
}

function createFrameLoop(
  renderer: RendererLike,
  scene: SceneLike,
  camera: CameraLike,
  requestAnimationFrameImpl: typeof window.requestAnimationFrame,
) {
  let frameHandle: number | null = null;

  const renderFrame = () => {
    renderer.render(scene as Scene, camera as PerspectiveCamera);
    frameHandle = requestAnimationFrameImpl(renderFrame);
  };

  return {
    getFrameHandle() {
      return frameHandle;
    },
    renderOnce() {
      renderer.render(scene as Scene, camera as PerspectiveCamera);
    },
    start() {
      if (frameHandle !== null) {
        return;
      }

      renderFrame();
    },
    stop(cancelAnimationFrameImpl: typeof window.cancelAnimationFrame) {
      if (frameHandle === null) {
        return;
      }

      cancelAnimationFrameImpl(frameHandle);
      frameHandle = null;
    },
  };
}

export function createSceneEngine({
  canvas,
  cancelAnimationFrame = window.cancelAnimationFrame.bind(window),
  createCamera = createDefaultCamera,
  createRenderer = createDefaultRenderer,
  createScene = () => new Scene(),
  requestAnimationFrame = window.requestAnimationFrame.bind(window),
  viewport = window,
}: CreateSceneEngineOptions = {}): SceneEngine {
  const renderer = createRenderer(canvas);
  const scene = createScene();
  const camera = createCamera();
  const loop = createFrameLoop(renderer, scene, camera, requestAnimationFrame);
  const ownsCanvas = canvas === undefined;

  let host: HTMLElement | null = null;

  return {
    applyState(state) {
      if (host !== null) {
        host.dataset.sceneMode = state.mode;
      }

      renderer.domElement.dataset.sceneMode = state.mode;
    },
    dispose() {
      loop.stop(cancelAnimationFrame);
      disposeSceneResources(scene, renderer);

      if (ownsCanvas) {
        renderer.domElement.remove();
      }

      host = null;
    },
    mount(nextHost) {
      host = nextHost;

      const canvas = renderer.domElement;

      for (const existingCanvas of host.querySelectorAll<HTMLCanvasElement>(
        "canvas[data-scene-canvas='persistent']",
      )) {
        if (existingCanvas !== canvas) {
          existingCanvas.remove();
        }
      }

      if (canvas.parentElement !== host) {
        host.append(canvas);
      }
    },
    resize() {
      if (host === null) {
        return;
      }

      const size = measureSceneHost(host, viewport);

      resizeSceneRenderer({
        camera,
        devicePixelRatio: viewport.devicePixelRatio,
        renderer,
        size,
      });

      loop.renderOnce();
    },
    start() {
      loop.start();
    },
    stop() {
      loop.stop(cancelAnimationFrame);
    },
  };
}
