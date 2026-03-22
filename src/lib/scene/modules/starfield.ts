import {
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial,
  Scene,
} from "three";

import {
  sceneBudgets,
  type SceneBudget,
} from "@/lib/scene/budgets";
import type { SceneState } from "@/lib/scene/state-types";

type CreateStarfieldOptions = {
  count?: number;
  scene: Scene;
  seed?: number;
};

export type Starfield = {
  applyState: (state: SceneState) => void;
  dispose: () => void;
  material: PointsMaterial;
  points: Points;
  setBudget: (budget: Pick<SceneBudget, "starfieldCount">) => void;
  update: (deltaSeconds: number, elapsedSeconds: number) => void;
};

type DrawRangeGeometry = BufferGeometry & {
  drawRange: {
    count: number;
    start: number;
  };
};

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

export function createStarfield({
  count = sceneBudgets.home["desktop-default"].starfieldCount,
  scene,
  seed = 11,
}: CreateStarfieldOptions): Starfield {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;

    positions[offset + 0] = (random() - 0.5) * 18;
    positions[offset + 1] = (random() - 0.5) * 12;
    positions[offset + 2] = -2 - random() * 16;
  }

  const geometry = new BufferGeometry();
  const drawRangeGeometry = geometry as DrawRangeGeometry;
  const material = new PointsMaterial({
    color: 0xffffff,
    depthWrite: false,
    opacity: 0.72,
    size: 0.05,
    sizeAttenuation: true,
    transparent: true,
  });
  const points = new Points(geometry, material);

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  drawRangeGeometry.drawRange.start = 0;
  drawRangeGeometry.drawRange.count = count;
  scene.add(points);

  return {
    applyState() {},
    dispose() {
      points.removeFromParent();
      geometry.dispose();
      material.dispose();
    },
    material,
    points,
    setBudget(budget) {
      drawRangeGeometry.drawRange.start = 0;
      drawRangeGeometry.drawRange.count = Math.max(0, Math.min(count, budget.starfieldCount));
    },
    update(_deltaSeconds, elapsedSeconds) {
      points.rotation.y = elapsedSeconds * 0.015;
      points.rotation.x = Math.sin(elapsedSeconds * 0.12) * 0.02;
    },
  };
}
