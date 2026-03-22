import type { SceneState } from "@/lib/scene/state-types";

import {
  resolveSceneTapOutcome,
  type SceneTapSurface,
} from "@/lib/scene/modules/cube-step";

const focusDragThresholdPx = 10;

type FocusDragOffset = {
  x: number;
  y: number;
};

type FocusControlsOptions = {
  getSceneState: () => SceneState;
  getTargetPolicy?: (target: EventTarget | null) => "allow" | "block" | "cube-hit-only";
  hitTestCube: (clientX: number, clientY: number) => boolean;
  onEndFocusDrag: (pointerId: number, reason: "pointercancel" | "pointerup") => void;
  onEnterFocus: () => void;
  onExitFocus: () => void;
  onStartFocusDrag: (pointerId: number) => void;
  onStepCube: () => void;
  setFocusDragOffset: (offset: FocusDragOffset) => void;
  target?: Pick<Window, "addEventListener" | "removeEventListener">;
  viewportElement: HTMLElement;
};

export type FocusControls = {
  dispose: () => void;
  syncSceneState: (state: SceneState) => void;
};

type GestureSession = {
  dragStarted: boolean;
  pointerId: number;
  startX: number;
  startY: number;
  startedInFocus: boolean;
  surface: SceneTapSurface;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function exceededDragThreshold(session: GestureSession, event: PointerEvent) {
  const deltaX = event.clientX - session.startX;
  const deltaY = event.clientY - session.startY;

  return deltaX ** 2 + deltaY ** 2 >= focusDragThresholdPx ** 2;
}

function normalizeFocusDragOffset(
  viewportElement: HTMLElement,
  session: GestureSession,
  event: PointerEvent,
): FocusDragOffset {
  const rect = viewportElement.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);

  return {
    x: clamp((event.clientX - session.startX) / (width * 0.5), -1, 1),
    y: clamp((session.startY - event.clientY) / (height * 0.5), -1, 1),
  };
}

export function createFocusControls({
  getSceneState,
  getTargetPolicy,
  hitTestCube,
  onEndFocusDrag,
  onEnterFocus,
  onExitFocus,
  onStartFocusDrag,
  onStepCube,
  setFocusDragOffset,
  target = window,
  viewportElement,
}: FocusControlsOptions): FocusControls {
  let gestureSession: GestureSession | null = null;

  const clearGestureSession = () => {
    gestureSession = null;
    setFocusDragOffset({ x: 0, y: 0 });
  };

  const cancelGestureSession = (reason: "pointercancel" | "pointerup") => {
    if (gestureSession?.dragStarted) {
      onEndFocusDrag(gestureSession.pointerId, reason);
    }

    clearGestureSession();
  };

  const handlePointerDown = (event: Event) => {
    const pointerEvent = event as PointerEvent;
    const surface = hitTestCube(pointerEvent.clientX, pointerEvent.clientY) ? "cube" : "background";
    const targetPolicy = getTargetPolicy?.(pointerEvent.target) ?? "allow";

    if (
      pointerEvent.button > 0 ||
      targetPolicy === "block" ||
      (targetPolicy === "cube-hit-only" && surface !== "cube")
    ) {
      return;
    }

    const state = getSceneState();

    if (state.mode === "article-reading") {
      return;
    }

    gestureSession = {
      dragStarted: false,
      pointerId: pointerEvent.pointerId,
      startX: pointerEvent.clientX,
      startY: pointerEvent.clientY,
      startedInFocus: state.mode === "home-cube-focus",
      surface,
    };
  };

  const handlePointerMove = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (
      gestureSession === null ||
      gestureSession.pointerId !== pointerEvent.pointerId ||
      !gestureSession.startedInFocus
    ) {
      return;
    }

    if (!gestureSession.dragStarted) {
      if (!exceededDragThreshold(gestureSession, pointerEvent)) {
        return;
      }

      gestureSession.dragStarted = true;
      onStartFocusDrag(pointerEvent.pointerId);
    }

    setFocusDragOffset(normalizeFocusDragOffset(viewportElement, gestureSession, pointerEvent));
  };

  const handlePointerUp = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (gestureSession === null || gestureSession.pointerId !== pointerEvent.pointerId) {
      return;
    }

    if (gestureSession.dragStarted) {
      cancelGestureSession("pointerup");
      return;
    }

    const outcome = resolveSceneTapOutcome(getSceneState(), gestureSession.surface);

    clearGestureSession();

    if (outcome === "enter-focus") {
      onEnterFocus();
      return;
    }

    if (outcome === "step-cube") {
      onStepCube();
    }
  };

  const handlePointerCancel = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (gestureSession === null || gestureSession.pointerId !== pointerEvent.pointerId) {
      return;
    }

    cancelGestureSession("pointercancel");
  };

  const handleKeyDown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key !== "Escape" || getSceneState().mode !== "home-cube-focus") {
      return;
    }

    keyboardEvent.preventDefault();
    cancelGestureSession("pointercancel");
    onExitFocus();
  };

  target.addEventListener("pointerdown", handlePointerDown);
  target.addEventListener("pointermove", handlePointerMove);
  target.addEventListener("pointerup", handlePointerUp);
  target.addEventListener("pointercancel", handlePointerCancel);
  target.addEventListener("keydown", handleKeyDown);

  return {
    dispose() {
      target.removeEventListener("pointerdown", handlePointerDown);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
      target.removeEventListener("pointercancel", handlePointerCancel);
      target.removeEventListener("keydown", handleKeyDown);
      clearGestureSession();
    },
    syncSceneState(state) {
      if (state.mode !== "home-cube-focus") {
        cancelGestureSession("pointercancel");
      }
    },
  };
}
