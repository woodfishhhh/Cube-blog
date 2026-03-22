export const homeModes = [
  "home-hero",
  "home-blog",
  "home-author",
  "home-cube-focus",
] as const;

export type HomeMode = (typeof homeModes)[number];
export type SceneMode = HomeMode | "article-reading";

export type InputOwner = "none" | "scene-focus-drag";

export type SceneState = {
  mode: SceneMode;
  lastHomeMode: HomeMode;
  inputOwner: InputOwner;
  activePointerId: number | null;
  activeArticleSlug: string | null;
};

export type HomeDisplayMode = Exclude<HomeMode, "home-cube-focus">;
export type WheelDirection = "forward" | "backward";
export type ScrollBoundary = "start" | "middle" | "end";

export type SceneTransitionEvent =
  | { type: "home-mode-selected"; origin: "ui"; target: HomeDisplayMode }
  | { type: "cube-step-selected"; origin: "scene"; target: HomeDisplayMode }
  | {
      type: "home-wheel-snapped";
      origin: "ui" | "scene";
      direction: WheelDirection;
    }
  | { type: "cube-focus-entered"; origin: "scene" }
  | {
      type: "focus-drag-started";
      origin: "scene";
      pointerId: number;
    }
  | {
      type: "focus-drag-ended";
      origin: "scene";
      pointerId: number;
      reason: "pointerup" | "pointercancel";
    }
  | { type: "article-entered"; origin: "route"; slug: string }
  | { type: "article-exited"; origin: "route" };

export type TransitionEffect =
  | { type: "scene-sync-home-mode"; mode: HomeDisplayMode }
  | { type: "scene-cube-step"; mode: HomeDisplayMode }
  | {
      type: "scene-wheel-snap";
      mode: HomeDisplayMode;
      direction: WheelDirection;
    }
  | { type: "scene-focus-cube" }
  | { type: "scene-focus-drag-start"; pointerId: number }
  | {
      type: "scene-focus-drag-end";
      pointerId: number;
      reason: "pointerup" | "pointercancel";
    }
  | { type: "content-enter-article"; slug: string }
  | { type: "content-exit-article"; restoreMode: HomeMode };

export type TransitionResult = {
  state: SceneState;
  effects: TransitionEffect[];
};

export type SceneInputIntent =
  | { type: "home-nav-click"; origin: "ui"; target: HomeDisplayMode }
  | { type: "cube-face-click"; origin: "ui" | "scene"; target: HomeDisplayMode }
  | { type: "cube-focus-click"; origin: "ui" | "scene" }
  | {
      type: "panel-scroll-wheel";
      origin: "ui";
      direction: WheelDirection;
      boundary: ScrollBoundary;
    }
  | {
      type: "scene-wheel";
      origin: "scene";
      direction: WheelDirection;
    }
  | {
      type: "focus-drag";
      origin: "ui" | "scene";
      phase: "start" | "end" | "cancel";
      pointerId: number;
    }
  | { type: "article-route-change"; origin: "route"; phase: "enter"; slug: string }
  | { type: "article-route-change"; origin: "route"; phase: "exit" };

export type InputDecision =
  | {
      allowed: true;
      owner: "ui" | "scene" | "route";
      event: SceneTransitionEvent;
    }
  | {
      allowed: false;
      owner: "blocked";
      reason:
        | "ui-cannot-enter-focus"
        | "drag-requires-focus"
        | "ui-cannot-drag-focus"
        | "panel-scroll-not-at-boundary"
        | "article-reading-locks-home-gestures"
        | "scene-event-only";
    };

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}
