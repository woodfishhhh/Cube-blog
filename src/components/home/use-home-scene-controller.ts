"use client";

import { useCallback, useSyncExternalStore } from "react";

import { resolveInputIntent } from "@/lib/scene/input-policy";
import { createInitialSceneState, transitionSceneState } from "@/lib/scene/state-machine";
import type {
  HomeDisplayMode,
  InputDecision,
  SceneInputIntent,
  SceneState,
  TransitionEffect,
} from "@/lib/scene/state-types";

type Listener = () => void;
type EffectListener = (effect: TransitionEffect) => void;

let currentSceneState = createInitialSceneState();

const stateListeners = new Set<Listener>();
const effectListeners = new Set<EffectListener>();

function emitStateChange() {
  for (const listener of stateListeners) {
    listener();
  }
}

function emitEffects(effects: TransitionEffect[]) {
  if (effects.length === 0) {
    return;
  }

  for (const effect of effects) {
    for (const listener of effectListeners) {
      listener(effect);
    }
  }
}

function commitIntent(intent: SceneInputIntent): InputDecision {
  const decision = resolveInputIntent(currentSceneState, intent);

  if (!decision.allowed) {
    return decision;
  }

  const result = transitionSceneState(currentSceneState, decision.event);

  currentSceneState = result.state;
  emitStateChange();
  emitEffects(result.effects);

  return decision;
}

export function getHomeSceneState() {
  return currentSceneState;
}

export function subscribeHomeSceneState(listener: Listener) {
  stateListeners.add(listener);

  return () => {
    stateListeners.delete(listener);
  };
}

export function subscribeHomeSceneEffects(listener: EffectListener) {
  effectListeners.add(listener);

  return () => {
    effectListeners.delete(listener);
  };
}

export function dispatchHomeSceneIntent(intent: SceneInputIntent) {
  return commitIntent(intent);
}

export function useHomeSceneState() {
  return useSyncExternalStore(subscribeHomeSceneState, getHomeSceneState, getHomeSceneState);
}

function getHomeDisplayMode(state: SceneState): HomeDisplayMode {
  if (state.mode === "article-reading" || state.mode === "home-cube-focus") {
    return state.lastHomeMode === "home-cube-focus" ? "home-hero" : state.lastHomeMode;
  }

  return state.mode;
}

export function useHomeSceneController() {
  const sceneState = useHomeSceneState();
  const activeMode = getHomeDisplayMode(sceneState);
  const selectMode = useCallback((target: HomeDisplayMode) => {
    dispatchHomeSceneIntent({
      type: "home-nav-click",
      origin: "ui",
      target,
    });
  }, []);

  return {
    activeMode,
    sceneState,
    selectMode,
  };
}

export function resetHomeSceneController() {
  currentSceneState = createInitialSceneState();
  emitStateChange();
}
