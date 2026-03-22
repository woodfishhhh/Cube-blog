import { PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import type { Object3D } from "three";

import {
  sceneBudgets,
  type SceneBudget,
} from "@/lib/scene/budgets";
import { disposeSceneResources } from "@/lib/scene/engine/dispose";
import { measureSceneHost, resizeSceneRenderer } from "@/lib/scene/engine/resize";
import { createCameraRig, type CameraRig } from "@/lib/scene/modules/camera-rig";
import { createFloatingCube, type FloatingCube } from "@/lib/scene/modules/cube";
import { createPointerTracker, type PointerTracker } from "@/lib/scene/modules/pointer";
import { createStarfield, type Starfield } from "@/lib/scene/modules/starfield";
import type { SceneState } from "@/lib/scene/state-types";

type RendererLike = Pick<
  WebGLRenderer,
  "dispose" | "domElement" | "render" | "setPixelRatio" | "setSize"
>;
type CameraLike = {
  aspect: number;
  position: { x: number; y: number; z: number };
  updateProjectionMatrix: () => void;
};
type SceneLike = Pick<Object3D, "traverse">;
type PointerEventTargetLike = Pick<Window, "addEventListener" | "removeEventListener">;
type ViewportLike = Pick<Window, "devicePixelRatio" | "innerHeight" | "innerWidth">;

const cubeHitSampleOffsets = [
  { x: 0, y: 0 },
  { x: 12, y: 0 },
  { x: -12, y: 0 },
  { x: 0, y: 12 },
  { x: 0, y: -12 },
  { x: 18, y: 18 },
  { x: 18, y: -18 },
  { x: -18, y: 18 },
  { x: -18, y: -18 },
] as const;

type SceneActors = {
  cameraRig: Pick<
    CameraRig,
    | "applyState"
    | "dispose"
    | "setBudget"
    | "setFocusDragOffset"
    | "setReducedMotion"
    | "update"
  >;
  cube: Pick<FloatingCube, "applyState" | "dispose" | "setBudget" | "step" | "update"> &
    Partial<Pick<FloatingCube, "mesh" | "setReducedMotion">>;
  pointer: Pick<PointerTracker, "dispose" | "state">;
  starfield: Pick<Starfield, "applyState" | "dispose" | "setBudget" | "update">;
};

type CreateSceneActorsOptions = {
  camera: CameraLike;
  pointerEventTarget: PointerEventTargetLike & ViewportLike;
  scene: SceneLike;
};

type CreateSceneEngineOptions = {
  canvas?: HTMLCanvasElement;
  cancelAnimationFrame?: typeof window.cancelAnimationFrame;
  createActors?: (options: CreateSceneActorsOptions) => SceneActors;
  createCamera?: () => CameraLike;
  createRenderer?: (canvas?: HTMLCanvasElement) => RendererLike;
  createScene?: () => SceneLike;
  now?: () => number;
  pointerEventTarget?: PointerEventTargetLike & ViewportLike;
  requestAnimationFrame?: typeof window.requestAnimationFrame;
  viewport?: ViewportLike;
};

export type SceneEngine = {
  applyState: (state: SceneState) => void;
  dispose: () => void;
  hitTestCube: (clientX: number, clientY: number) => boolean;
  mount: (host: HTMLElement) => void;
  resize: () => void;
  setBudget: (budget: SceneBudget) => void;
  setFocusDragOffset: (offset: { x: number; y: number }) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  start: () => void;
  stepCube: () => number;
  stop: () => void;
};

function createDefaultSceneActors({
  camera,
  pointerEventTarget,
  scene,
}: CreateSceneActorsOptions): SceneActors {
  const pointer = createPointerTracker({ target: pointerEventTarget });
  const cube = createFloatingCube({ scene: scene as Scene });
  const starfield = createStarfield({ scene: scene as Scene });
  const focusDrag = { x: 0, y: 0 };
  const cameraRig = createCameraRig({
    camera: camera as PerspectiveCamera,
    focusDrag,
    pointer,
  });

  return {
    cameraRig,
    cube,
    pointer,
    starfield,
  };
}

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
  onFrame: (deltaSeconds: number, elapsedSeconds: number) => void,
  now: () => number,
  requestAnimationFrameImpl: typeof window.requestAnimationFrame,
) {
  let frameHandle: number | null = null;
  let startTime = now();
  let lastFrameTime = startTime;

  const renderFrame = () => {
    const currentTime = now();
    const deltaSeconds = Math.max(
      0,
      Math.min(0.1, (currentTime - lastFrameTime) / 1000),
    );
    const elapsedSeconds = Math.max(0, (currentTime - startTime) / 1000);

    lastFrameTime = currentTime;
    onFrame(deltaSeconds, elapsedSeconds);
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

      startTime = now();
      lastFrameTime = startTime;

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
  createActors = createDefaultSceneActors,
  createCamera = createDefaultCamera,
  createRenderer = createDefaultRenderer,
  createScene = () => new Scene(),
  now = () => performance.now(),
  pointerEventTarget = window,
  requestAnimationFrame = window.requestAnimationFrame.bind(window),
  viewport = window,
}: CreateSceneEngineOptions = {}): SceneEngine {
  let currentBudget = sceneBudgets.home["desktop-default"];
  const renderer = createRenderer(canvas);
  const scene = createScene();
  const camera = createCamera();
  const actors = createActors({ camera, pointerEventTarget, scene });
  const loop = createFrameLoop(
    renderer,
    scene,
    camera,
    (deltaSeconds, elapsedSeconds) => {
      actors.starfield.update(deltaSeconds, elapsedSeconds);
      actors.cube.update(deltaSeconds, elapsedSeconds);
      actors.cameraRig.update(deltaSeconds);
    },
    now,
    requestAnimationFrame,
  );
  const ownsCanvas = canvas === undefined;
  const cubeRaycaster = new Raycaster();
  const cubeRayPointer = new Vector2();

  const applyBudget = (budget: SceneBudget) => {
    currentBudget = budget;
    actors.starfield.setBudget(currentBudget);
    actors.cube.setBudget(currentBudget);
    actors.cameraRig.setBudget(currentBudget);
  };

  let host: HTMLElement | null = null;

  applyBudget(currentBudget);

  return {
    applyState(state) {
      actors.cube.applyState(state);
      actors.starfield.applyState(state);
      actors.cameraRig.applyState(state);

      if (host !== null) {
        host.dataset.sceneMode = state.mode;
      }

      renderer.domElement.dataset.sceneMode = state.mode;
    },
    dispose() {
      loop.stop(cancelAnimationFrame);
      actors.pointer.dispose();
      actors.cameraRig.dispose();
      actors.cube.dispose();
      actors.starfield.dispose();
      disposeSceneResources(scene, renderer);

      if (ownsCanvas) {
        renderer.domElement.remove();
      }

      host = null;
    },
    hitTestCube(clientX, clientY) {
      const cubeMesh = actors.cube.mesh;

      if (cubeMesh === undefined) {
        return false;
      }

      const rect = renderer.domElement.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return false;
      }

      for (const offset of cubeHitSampleOffsets) {
        cubeRayPointer.x = ((clientX + offset.x - rect.left) / rect.width) * 2 - 1;
        cubeRayPointer.y = -((clientY + offset.y - rect.top) / rect.height) * 2 + 1;

        cubeRaycaster.setFromCamera(cubeRayPointer, camera as PerspectiveCamera);

        if (cubeRaycaster.intersectObject(cubeMesh, true).length > 0) {
          return true;
        }
      }

      return false;
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
    setBudget(budget) {
      applyBudget(budget);
    },
    setFocusDragOffset(offset) {
      actors.cameraRig.setFocusDragOffset(offset);
    },
    setReducedMotion(reducedMotion) {
      actors.cameraRig.setReducedMotion(reducedMotion);
      actors.cube.setReducedMotion?.(reducedMotion);

      if (host !== null) {
        host.dataset.sceneMotion = reducedMotion ? "reduced" : "full";
      }

      renderer.domElement.dataset.sceneMotion = reducedMotion ? "reduced" : "full";
    },
    start() {
      loop.start();
    },
    stepCube() {
      return actors.cube.step();
    },
    stop() {
      loop.stop(cancelAnimationFrame);
    },
  };
}
