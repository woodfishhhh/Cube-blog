import { describe, expect, it } from "vitest";

import {
  CAMERA_INTRO_DURATION,
  CAMERA_INTRO_START_LOOK,
  CAMERA_INTRO_START_POSITION,
  getCameraIntroPose,
} from "@/components/canvas/camera-intro";

describe("getCameraIntroPose", () => {
  it("starts from the far cinematic intro pose", () => {
    const pose = getCameraIntroPose(0, [0, 0, 10], [0, 0, 0]);

    expect(pose.isComplete).toBe(false);
    expect(pose.position).toEqual(CAMERA_INTRO_START_POSITION);
    expect(pose.lookAt).toEqual(CAMERA_INTRO_START_LOOK);
  });

  it("lands exactly on the target pose at the end of the intro", () => {
    const pose = getCameraIntroPose(1, [1, 2, 12], [0.5, -0.25, 0]);

    expect(pose.isComplete).toBe(true);
    expect(pose.position).toEqual([1, 2, 12]);
    expect(pose.lookAt).toEqual([0.5, -0.25, 0]);
  });

  it("exposes the intended intro duration as a stable contract", () => {
    expect(CAMERA_INTRO_DURATION).toBeGreaterThan(1);
    expect(CAMERA_INTRO_DURATION).toBeLessThan(3);
  });
});
