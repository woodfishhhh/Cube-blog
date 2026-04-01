export const CAMERA_INTRO_DURATION = 1.8;
export const CAMERA_INTRO_START_POSITION: [number, number, number] = [0, 1.5, 92];
export const CAMERA_INTRO_START_LOOK: [number, number, number] = [0, 0, 0];

type Vec3 = [number, number, number];

export function getCameraIntroPose(
  progress: number,
  targetPosition: Vec3,
  targetLookAt: Vec3,
) {
  const normalizedProgress = clamp(progress, 0, 1);
  const easedProgress = 1 - Math.pow(1 - normalizedProgress, 4);

  return {
    isComplete: normalizedProgress >= 1,
    position: lerpVec3(CAMERA_INTRO_START_POSITION, targetPosition, easedProgress),
    lookAt: lerpVec3(CAMERA_INTRO_START_LOOK, targetLookAt, easedProgress),
  };
}

function lerpVec3(from: Vec3, to: Vec3, progress: number): Vec3 {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
    from[2] + (to[2] - from[2]) * progress,
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
