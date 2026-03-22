import type {
  InputDecision,
  SceneInputIntent,
  SceneState,
} from "@/lib/scene/state-types";
import { assertNever } from "@/lib/scene/state-types";

function blockArticleReadingHomeGesture(state: SceneState): InputDecision | null {
  if (state.mode !== "article-reading") {
    return null;
  }

  return {
    allowed: false,
    owner: "blocked" as const,
    reason: "article-reading-locks-home-gestures" as const,
  };
}

export function resolveInputIntent(
  state: SceneState,
  intent: SceneInputIntent,
): InputDecision {
  switch (intent.type) {
    case "home-nav-click": {
      return {
        allowed: true,
        owner: "ui",
        event: {
          type: "home-mode-selected",
          origin: intent.origin,
          target: intent.target,
        },
      };
    }
    case "cube-face-click": {
      if (intent.origin === "ui") {
        return {
          allowed: true,
          owner: "ui",
          event: {
            type: "home-mode-selected",
            origin: "ui",
            target: intent.target,
          },
        };
      }

      return {
        allowed: true,
        owner: "scene",
        event: {
          type: "cube-step-selected",
          origin: "scene",
          target: intent.target,
        },
      };
    }
    case "cube-focus-click": {
      const articleReadingDecision = blockArticleReadingHomeGesture(state);

      if (articleReadingDecision !== null) {
        return articleReadingDecision;
      }

      if (intent.origin === "ui") {
        return {
          allowed: false,
          owner: "blocked",
          reason: "ui-cannot-enter-focus",
        };
      }

      return {
        allowed: true,
        owner: "scene",
        event: {
          type: "cube-focus-entered",
          origin: "scene",
        },
      };
    }
    case "panel-scroll-wheel": {
      const articleReadingDecision = blockArticleReadingHomeGesture(state);

      if (articleReadingDecision !== null) {
        return articleReadingDecision;
      }

      if (intent.boundary === "middle") {
        return {
          allowed: false,
          owner: "blocked",
          reason: "panel-scroll-not-at-boundary",
        };
      }

      if (
        (intent.direction === "forward" && intent.boundary !== "end") ||
        (intent.direction === "backward" && intent.boundary !== "start")
      ) {
        return {
          allowed: false,
          owner: "blocked",
          reason: "panel-scroll-not-at-boundary",
        };
      }

      return {
        allowed: true,
        owner: "ui",
        event: {
          type: "home-wheel-snapped",
          origin: "ui",
          direction: intent.direction,
        },
      };
    }
    case "scene-wheel": {
      const articleReadingDecision = blockArticleReadingHomeGesture(state);

      if (articleReadingDecision !== null) {
        return articleReadingDecision;
      }

      return {
        allowed: true,
        owner: "scene",
        event: {
          type: "home-wheel-snapped",
          origin: "scene",
          direction: intent.direction,
        },
      };
    }
    case "focus-drag": {
      const articleReadingDecision = blockArticleReadingHomeGesture(state);

      if (articleReadingDecision !== null) {
        return articleReadingDecision;
      }

      if (intent.origin === "ui") {
        return {
          allowed: false,
          owner: "blocked",
          reason: "ui-cannot-drag-focus",
        };
      }

      if (state.mode !== "home-cube-focus") {
        return {
          allowed: false,
          owner: "blocked",
          reason: "drag-requires-focus",
        };
      }

      if (intent.phase === "start") {
        return {
          allowed: true,
          owner: "scene",
          event: {
            type: "focus-drag-started",
            origin: "scene",
            pointerId: intent.pointerId,
          },
        };
      }

      return {
        allowed: true,
        owner: "scene",
        event: {
          type: "focus-drag-ended",
          origin: "scene",
          pointerId: intent.pointerId,
          reason: intent.phase === "end" ? "pointerup" : "pointercancel",
        },
      };
    }
    case "article-route-change": {
      if (intent.phase === "enter") {
        return {
          allowed: true,
          owner: "route",
          event: {
            type: "article-entered",
            origin: "route",
            slug: intent.slug,
          },
        };
      }

      return {
        allowed: true,
        owner: "route",
        event: {
          type: "article-exited",
          origin: "route",
        },
      };
    }
    default:
      return assertNever(intent);
  }
}
