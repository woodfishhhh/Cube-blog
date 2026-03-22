import type { SceneMode } from "@/lib/scene/state-types";

export type SceneBudgetTier = "desktop-default" | "mobile" | "reduced-motion";

export type SceneBudget = {
  cameraAmbientMotionScale: number;
  cameraParallaxScale: number;
  cubeAmbientMotionScale: number;
  starfieldCount: number;
};

export type ActiveSceneBudgetState = "article-reading" | "home";

export type ResolveSceneBudgetOptions = {
  reducedMotion: boolean;
  sceneEnabled: boolean;
  sceneMode: SceneMode;
  touchLayout: boolean;
};

const disabledSceneBudget: SceneBudget = {
  cameraAmbientMotionScale: 0,
  cameraParallaxScale: 0,
  cubeAmbientMotionScale: 0,
  starfieldCount: 0,
};

export const sceneBudgets: Record<
  ActiveSceneBudgetState,
  Record<SceneBudgetTier, SceneBudget>
> & {
  disabled: SceneBudget;
} = {
  home: {
    "desktop-default": {
      cameraAmbientMotionScale: 1,
      cameraParallaxScale: 1,
      cubeAmbientMotionScale: 1,
      starfieldCount: 160,
    },
    mobile: {
      cameraAmbientMotionScale: 0.4,
      cameraParallaxScale: 0.25,
      cubeAmbientMotionScale: 0.45,
      starfieldCount: 72,
    },
    "reduced-motion": {
      cameraAmbientMotionScale: 0.18,
      cameraParallaxScale: 0.2,
      cubeAmbientMotionScale: 0.2,
      starfieldCount: 96,
    },
  },
  "article-reading": {
    "desktop-default": {
      cameraAmbientMotionScale: 0.3,
      cameraParallaxScale: 0.2,
      cubeAmbientMotionScale: 0.35,
      starfieldCount: 96,
    },
    mobile: {
      cameraAmbientMotionScale: 0.15,
      cameraParallaxScale: 0.1,
      cubeAmbientMotionScale: 0.18,
      starfieldCount: 36,
    },
    "reduced-motion": {
      cameraAmbientMotionScale: 0.06,
      cameraParallaxScale: 0.05,
      cubeAmbientMotionScale: 0.08,
      starfieldCount: 48,
    },
  },
  disabled: disabledSceneBudget,
};

export function resolveSceneBudgetState(sceneMode: SceneMode): ActiveSceneBudgetState {
  return sceneMode === "article-reading" ? "article-reading" : "home";
}

export function resolveSceneBudgetTier({
  reducedMotion,
  touchLayout,
}: Pick<ResolveSceneBudgetOptions, "reducedMotion" | "touchLayout">): SceneBudgetTier {
  if (reducedMotion) {
    return "reduced-motion";
  }

  if (touchLayout) {
    return "mobile";
  }

  return "desktop-default";
}

export function resolveSceneBudget(options: ResolveSceneBudgetOptions): SceneBudget {
  if (!options.sceneEnabled) {
    return sceneBudgets.disabled;
  }

  const sceneBudgetState = resolveSceneBudgetState(options.sceneMode);
  const sceneBudgetTier = resolveSceneBudgetTier(options);

  return sceneBudgets[sceneBudgetState][sceneBudgetTier];
}
