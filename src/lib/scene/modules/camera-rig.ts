import { PerspectiveCamera, Vector3 } from "three";

import {
  sceneBudgets,
  type SceneBudget,
} from "@/lib/scene/budgets";
import type { SceneState } from "@/lib/scene/state-types";
import type { PointerTracker } from "@/lib/scene/modules/pointer";

const sceneRestPoses = {
  "article-reading": {
    position: new Vector3(2.3, 0.1, 6.4),
    target: new Vector3(1.4, -0.15, 0),
  },
  "home-author": {
    position: new Vector3(-0.85, 0.15, 6.05),
    target: new Vector3(-0.55, 0.02, 0),
  },
  "home-blog": {
    position: new Vector3(0.85, 0.15, 6.05),
    target: new Vector3(0.55, 0.02, 0),
  },
  "home-cube-focus": {
    position: new Vector3(0, 0.22, 4.6),
    target: new Vector3(0, 0.04, 0),
  },
  "home-hero": {
    position: new Vector3(0, 0, 6),
    target: new Vector3(0, 0, 0),
  },
} as const;

type RestPose = {
  position?: Vector3;
  target?: Vector3;
};

type FocusDragOffset = {
  x: number;
  y: number;
};

type CreateCameraRigOptions = {
  camera: PerspectiveCamera;
  damping?: number;
  defaultPosition?: Vector3;
  defaultTarget?: Vector3;
  focusDrag?: FocusDragOffset;
  pointer: Pick<PointerTracker, "state">;
  reducedMotion?: boolean;
};

type SetRestPoseOptions = {
  snap?: boolean;
};

export type CameraRig = {
  applyState: (state: SceneState) => void;
  dispose: () => void;
  setBudget: (
    budget: Pick<SceneBudget, "cameraAmbientMotionScale" | "cameraParallaxScale">,
  ) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setFocusDragOffset: (offset: FocusDragOffset) => void;
  setRestPose: (pose: RestPose, options?: SetRestPoseOptions) => void;
  update: (deltaSeconds: number) => void;
};

function damp(current: number, target: number, lambda: number, deltaSeconds: number) {
  const mix = 1 - Math.exp(-lambda * deltaSeconds);

  return current + (target - current) * mix;
}

export function createCameraRig({
  camera,
  damping = 4.5,
  defaultPosition = new Vector3(0, 0, 6),
  defaultTarget = new Vector3(0, 0, 0),
  focusDrag = { x: 0, y: 0 },
  pointer,
  reducedMotion = false,
}: CreateCameraRigOptions): CameraRig {
  const fullMotionBudget = sceneBudgets.home["desktop-default"];
  const reducedMotionBudget = sceneBudgets.home["reduced-motion"];
  const restPosition = defaultPosition.clone();
  const restTarget = defaultTarget.clone();
  const currentLookAt = defaultTarget.clone();

  let disposed = false;
  let elapsedSeconds = 0;
  let ambientMotionScale = reducedMotion
    ? reducedMotionBudget.cameraAmbientMotionScale
    : fullMotionBudget.cameraAmbientMotionScale;
  let hasExplicitBudget = false;
  let parallaxScale = reducedMotion
    ? reducedMotionBudget.cameraParallaxScale
    : fullMotionBudget.cameraParallaxScale;
  let sceneMode: SceneState["mode"] = "home-hero";

  camera.position.copy(restPosition);
  camera.lookAt(restTarget);

  return {
    applyState(state) {
      const pose = sceneRestPoses[state.mode];

      sceneMode = state.mode;
      restPosition.copy(pose.position);
      restTarget.copy(pose.target);

      if (state.mode !== "home-cube-focus") {
        focusDrag.x = 0;
        focusDrag.y = 0;
      }
    },
    dispose() {
      disposed = true;
    },
    setBudget(budget) {
      hasExplicitBudget = true;
      ambientMotionScale = budget.cameraAmbientMotionScale;
      parallaxScale = budget.cameraParallaxScale;
    },
    setReducedMotion(nextReducedMotion) {
      if (!hasExplicitBudget) {
        ambientMotionScale = nextReducedMotion
          ? reducedMotionBudget.cameraAmbientMotionScale
          : fullMotionBudget.cameraAmbientMotionScale;
        parallaxScale = nextReducedMotion
          ? reducedMotionBudget.cameraParallaxScale
          : fullMotionBudget.cameraParallaxScale;
      }
    },
    setFocusDragOffset(offset) {
      focusDrag.x = offset.x;
      focusDrag.y = offset.y;
    },
    setRestPose(nextPose, options = {}) {
      if (nextPose.position) {
        restPosition.copy(nextPose.position);
      }

      if (nextPose.target) {
        restTarget.copy(nextPose.target);
      }

      if (options.snap) {
        camera.position.copy(restPosition);
        currentLookAt.copy(restTarget);
        camera.lookAt(currentLookAt);
      }
    },
    update(deltaSeconds) {
      if (disposed) {
        return;
      }

      elapsedSeconds += deltaSeconds;

      const idleX = Math.sin(elapsedSeconds * 0.45) * 0.08 * ambientMotionScale;
      const idleY = Math.cos(elapsedSeconds * 0.35) * 0.12 * ambientMotionScale;
      const idleZ = Math.sin(elapsedSeconds * 0.2) * 0.04 * ambientMotionScale;
      const isFocusMode = sceneMode === "home-cube-focus";
      const pointerMix = isFocusMode ? 0 : 1;
      const focusMix = isFocusMode ? 1 : 0;
      const pointerX = pointer.state.x * 0.18 * pointerMix * parallaxScale;
      const pointerY = pointer.state.y * 0.14 * pointerMix * parallaxScale;
      const focusX = focusDrag.x * 0.9 * focusMix;
      const focusY = focusDrag.y * 0.75 * focusMix;
      const targetX = restPosition.x + pointerX + focusX + idleX;
      const targetY = restPosition.y + pointerY + focusY + idleY;
      const targetZ = restPosition.z + idleZ;

      camera.position.x = damp(camera.position.x, targetX, damping, deltaSeconds);
      camera.position.y = damp(camera.position.y, targetY, damping, deltaSeconds);
      camera.position.z = damp(camera.position.z, targetZ, damping, deltaSeconds);

      const lookAtX =
        restTarget.x +
        pointer.state.x * 0.05 * pointerMix * parallaxScale +
        focusX * 0.18 +
        idleX * 0.45;
      const lookAtY =
        restTarget.y +
        pointer.state.y * 0.04 * pointerMix * parallaxScale +
        focusY * 0.14 +
        idleY * 0.35;
      const lookAtZ = restTarget.z;

      currentLookAt.x = damp(currentLookAt.x, lookAtX, damping, deltaSeconds);
      currentLookAt.y = damp(currentLookAt.y, lookAtY, damping, deltaSeconds);
      currentLookAt.z = damp(currentLookAt.z, lookAtZ, damping, deltaSeconds);

      camera.lookAt(currentLookAt);
    },
  };
}
