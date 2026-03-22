import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

import {
  sceneBudgets,
  type SceneBudget,
} from "@/lib/scene/budgets";
import type { SceneState } from "@/lib/scene/state-types";

const cubeAnchors = {
  "article-reading": new Vector3(3.2, -0.6, -1.4),
  "home-author": new Vector3(-1.45, 0.08, 0),
  "home-blog": new Vector3(1.45, 0.08, 0),
  "home-cube-focus": new Vector3(0, 0.05, 0.35),
  "home-hero": new Vector3(0, 0.05, 0),
} as const;

type SetAnchorOptions = {
  snap?: boolean;
};

type CreateFloatingCubeOptions = {
  reducedMotion?: boolean;
  scene: Scene;
  size?: number;
};

export type FloatingCube = {
  applyState: (state: SceneState) => void;
  dispose: () => void;
  getStepIndex: () => number;
  mesh: Mesh;
  root: Mesh;
  setBudget: (budget: Pick<SceneBudget, "cubeAmbientMotionScale">) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setAnchor: (anchor: Vector3, options?: SetAnchorOptions) => void;
  step: () => number;
  update: (deltaSeconds: number, elapsedSeconds: number) => void;
};

function damp(current: number, target: number, lambda: number, deltaSeconds: number) {
  const mix = 1 - Math.exp(-lambda * deltaSeconds);

  return current + (target - current) * mix;
}

export function createFloatingCube({
  reducedMotion = false,
  scene,
  size = 1.35,
}: CreateFloatingCubeOptions): FloatingCube {
  const fullMotionScale = sceneBudgets.home["desktop-default"].cubeAmbientMotionScale;
  const reducedMotionScale = sceneBudgets.home["reduced-motion"].cubeAmbientMotionScale;
  const baseRotationX = -0.46;
  const baseRotationY = Math.PI / 4;
  const baseRotationZ = -0.12;
  const geometry = new BoxGeometry(size, size, size);
  const faceMaterial = new MeshBasicMaterial({
    color: 0x2a2a2a,
    opacity: 0.97,
    transparent: true,
  });
  const edgeMaterial = new LineBasicMaterial({
    color: 0xf5f5f5,
    opacity: 0.82,
    transparent: true,
  });
  const cube = new Mesh(geometry, faceMaterial);
  const edges = new LineSegments(new EdgesGeometry(geometry), edgeMaterial);
  const anchor = new Vector3(0, 0, 0);

  let disposed = false;
  let hasExplicitBudget = false;
  let motionScale = reducedMotion ? reducedMotionScale : fullMotionScale;
  let stepIndex = 0;
  let targetRotationY = baseRotationY;

  cube.rotation.x = baseRotationX;
  cube.rotation.y = baseRotationY;
  cube.rotation.z = baseRotationZ;
  cube.add(edges);
  scene.add(cube);

  return {
    applyState(state) {
      anchor.copy(cubeAnchors[state.mode]);
    },
    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;
      cube.removeFromParent();
      edges.geometry.dispose();
      edgeMaterial.dispose();
      geometry.dispose();
      faceMaterial.dispose();
    },
    getStepIndex() {
      return stepIndex;
    },
    mesh: cube,
    root: cube,
    setBudget(budget) {
      hasExplicitBudget = true;
      motionScale = budget.cubeAmbientMotionScale;
    },
    setReducedMotion(nextReducedMotion) {
      if (!hasExplicitBudget) {
        motionScale = nextReducedMotion ? reducedMotionScale : fullMotionScale;
      }
    },
    setAnchor(nextAnchor, options = {}) {
      anchor.copy(nextAnchor);

      if (options.snap) {
        cube.position.copy(anchor);
      }
    },
    step() {
      stepIndex += 1;
      targetRotationY = baseRotationY + stepIndex * (Math.PI / 2);

      return stepIndex;
    },
    update(deltaSeconds, elapsedSeconds) {
      if (disposed) {
        return;
      }

      const idleFloat = Math.sin(elapsedSeconds * 0.9) * 0.14 * motionScale;
      const idleTiltX = baseRotationX + Math.sin(elapsedSeconds * 0.55) * 0.05 * motionScale;
      const idleTiltZ = baseRotationZ + Math.cos(elapsedSeconds * 0.4) * 0.04 * motionScale;

      cube.position.x = damp(cube.position.x, anchor.x, 4.2, deltaSeconds);
      cube.position.y = damp(cube.position.y, anchor.y + idleFloat, 4.2, deltaSeconds);
      cube.position.z = damp(cube.position.z, anchor.z, 4.2, deltaSeconds);
      cube.rotation.x = damp(cube.rotation.x, idleTiltX, 5.2, deltaSeconds);
      cube.rotation.y = damp(cube.rotation.y, targetRotationY, 6.5, deltaSeconds);
      cube.rotation.z = damp(cube.rotation.z, idleTiltZ, 5.2, deltaSeconds);
    },
  };
}
