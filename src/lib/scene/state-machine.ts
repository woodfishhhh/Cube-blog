import type {
  HomeMode,
  SceneState,
  SceneTransitionEvent,
  TransitionResult,
} from "@/lib/scene/state-types";
import { assertNever } from "@/lib/scene/state-types";

const homeWheelOrder = ["home-hero", "home-blog", "home-author"] as const;

function getLastNonFocusHomeMode(state: SceneState): HomeMode {
  if (state.mode === "home-cube-focus" || state.mode === "article-reading") {
    return state.lastHomeMode;
  }

  return state.mode;
}

function getNextWheelMode(
  state: SceneState,
  direction: "forward" | "backward",
): (typeof homeWheelOrder)[number] | null {
  if (state.mode === "article-reading" || state.mode === "home-cube-focus") {
    return null;
  }

  const currentIndex = homeWheelOrder.indexOf(state.mode);

  if (currentIndex === -1) {
    return null;
  }

  const delta = direction === "forward" ? 1 : -1;
  const nextIndex = currentIndex + delta;

  return homeWheelOrder[nextIndex] ?? null;
}

export function createInitialSceneState(mode: HomeMode = "home-hero"): SceneState {
  return {
    mode,
    lastHomeMode: mode,
    inputOwner: "none",
    activePointerId: null,
    activeArticleSlug: null,
  };
}

export function transitionSceneState(
  state: SceneState,
  event: SceneTransitionEvent,
): TransitionResult {
  switch (event.type) {
    case "home-mode-selected": {
      return {
        state: {
          mode: event.target,
          lastHomeMode: event.target,
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: null,
        },
        effects: [{ type: "scene-sync-home-mode", mode: event.target }],
      };
    }
    case "cube-step-selected": {
      return {
        state: {
          mode: event.target,
          lastHomeMode: event.target,
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: null,
        },
        effects: [{ type: "scene-cube-step", mode: event.target }],
      };
    }
    case "home-wheel-snapped": {
      const nextMode = getNextWheelMode(state, event.direction);

      if (nextMode === null) {
        return { state, effects: [] };
      }

      return {
        state: {
          mode: nextMode,
          lastHomeMode: nextMode,
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: null,
        },
        effects: [
          {
            type: "scene-wheel-snap",
            mode: nextMode,
            direction: event.direction,
          },
        ],
      };
    }
    case "cube-focus-entered": {
      return {
        state: {
          ...state,
          mode: "home-cube-focus",
          lastHomeMode: getLastNonFocusHomeMode(state),
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: null,
        },
        effects: [{ type: "scene-focus-cube" }],
      };
    }
    case "focus-drag-started": {
      if (state.mode !== "home-cube-focus" || state.inputOwner !== "none") {
        return { state, effects: [] };
      }

      return {
        state: {
          ...state,
          inputOwner: "scene-focus-drag",
          activePointerId: event.pointerId,
        },
        effects: [{ type: "scene-focus-drag-start", pointerId: event.pointerId }],
      };
    }
    case "focus-drag-ended": {
      if (
        state.mode !== "home-cube-focus" ||
        state.inputOwner !== "scene-focus-drag" ||
        state.activePointerId !== event.pointerId
      ) {
        return { state, effects: [] };
      }

      return {
        state: {
          ...state,
          inputOwner: "none",
          activePointerId: null,
        },
        effects: [
          {
            type: "scene-focus-drag-end",
            pointerId: event.pointerId,
            reason: event.reason,
          },
        ],
      };
    }
    case "article-entered": {
      const lastHomeMode = getLastNonFocusHomeMode(state);

      return {
        state: {
          mode: "article-reading",
          lastHomeMode,
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: event.slug,
        },
        effects: [{ type: "content-enter-article", slug: event.slug }],
      };
    }
    case "article-exited": {
      if (state.mode !== "article-reading") {
        return { state, effects: [] };
      }

      return {
        state: {
          mode: state.lastHomeMode,
          lastHomeMode: state.lastHomeMode,
          inputOwner: "none",
          activePointerId: null,
          activeArticleSlug: null,
        },
        effects: [
          {
            type: "content-exit-article",
            restoreMode: state.lastHomeMode,
          },
        ],
      };
    }
    default:
      return assertNever(event);
  }
}
