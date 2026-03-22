import type { HomeDisplayMode, SceneState } from "@/lib/scene/state-types";

export type SceneTapSurface = "background" | "cube";
export type SceneTapOutcome = "enter-focus" | "noop" | "step-cube";

export function resolveSceneHomeDisplayMode(
  state: Pick<SceneState, "lastHomeMode" | "mode">,
): HomeDisplayMode {
  if (state.mode === "article-reading" || state.mode === "home-cube-focus") {
    return state.lastHomeMode === "home-cube-focus" ? "home-hero" : state.lastHomeMode;
  }

  return state.mode;
}

export function resolveSceneTapOutcome(
  state: SceneState,
  surface: SceneTapSurface,
): SceneTapOutcome {
  if (state.mode === "article-reading") {
    return "noop";
  }

  if (state.mode === "home-cube-focus") {
    return surface === "cube" ? "step-cube" : "noop";
  }

  return surface === "cube" ? "enter-focus" : "step-cube";
}
