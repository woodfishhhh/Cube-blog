"use client";

import { useCallback, useEffect, useRef } from "react";

import { AuthorPanel } from "@/components/home/AuthorPanel";
import { BlogPanel } from "@/components/home/BlogPanel";
import { CubeFocusHint } from "@/components/home/CubeFocusHint";
import { useHomeSceneController } from "@/components/home/use-home-scene-controller";
import { HeroIntro } from "@/components/home/HeroIntro";
import { dispatchHomeSceneIntent } from "@/components/home/use-home-scene-controller";
import type { HomePageData } from "@/lib/content/types";
import { resolveSceneHomeDisplayMode } from "@/lib/scene/modules/cube-step";
import { findScrollPanel, resolveScrollBoundary } from "@/lib/scene/scroll-handoff";
import type { WheelDirection } from "@/lib/scene/state-types";

type HomeExperienceProps = {
  data: HomePageData;
};

function resolveWheelDirection(deltaY: number): WheelDirection | null {
  if (deltaY > 0) {
    return "forward";
  }

  if (deltaY < 0) {
    return "backward";
  }

  return null;
}

function isDesktopWheelExperience() {
  if (typeof window === "undefined") {
    return false;
  }

  return !window.matchMedia?.("(pointer: coarse)")?.matches;
}

export function HomeExperience({ data }: HomeExperienceProps) {
  const { activeMode, sceneState } = useHomeSceneController();
  const homeRootRef = useRef<HTMLElement | null>(null);
  const isFocusMode = sceneState.mode === "home-cube-focus";
  const previousHomeMode = resolveSceneHomeDisplayMode(sceneState);
  const railPrimaryMode = activeMode === "home-author" ? "home-author" : "home-blog";
  const panelVisibility = isFocusMode ? "hidden" : activeMode === "home-hero" ? "tucked" : "visible";
  const handleRootWheel = useCallback((event: WheelEvent) => {
    if (!isDesktopWheelExperience()) {
      return;
    }

    const direction = resolveWheelDirection(event.deltaY);

    if (direction === null) {
      return;
    }

    const scrollPanel = findScrollPanel(event.target);

    if (scrollPanel !== null) {
      const decision = dispatchHomeSceneIntent({
        type: "panel-scroll-wheel",
        origin: "ui",
        direction,
        boundary: resolveScrollBoundary(scrollPanel, direction),
      });

      if (decision.allowed) {
        event.preventDefault();
      }

      return;
    }

    event.preventDefault();
    dispatchHomeSceneIntent({
      type: "scene-wheel",
      origin: "scene",
      direction,
    });
  }, []);

  useEffect(() => {
    const homeRoot = homeRootRef.current;

    if (homeRoot === null) {
      return;
    }

    homeRoot.addEventListener("wheel", handleRootWheel, { passive: false });

    return () => {
      homeRoot.removeEventListener("wheel", handleRootWheel);
    };
  }, [handleRootWheel]);

  return (
    <main
      ref={homeRootRef}
      className="home-experience"
      data-home-mode={activeMode}
      data-scene-mode={sceneState.mode}
      data-home-visibility={panelVisibility}
      aria-label="Homepage editorial shell"
    >
      <div className="home-experience__lead" data-home-active={activeMode === "home-hero"}>
        <HeroIntro hero={data.hero} />
      </div>

      <section
        className="home-panel-rail"
        aria-label="Homepage overview panels"
        data-home-visibility={panelVisibility}
        data-home-active-mode={activeMode}
        data-home-primary-mode={railPrimaryMode}
        data-scene-mode={sceneState.mode}
      >
        <div className="home-panel-rail__stack">
          <div className="home-panel-rail__panel" data-home-panel-mode="home-blog">
            <BlogPanel posts={data.posts} />
          </div>
          <div className="home-panel-rail__panel" data-home-panel-mode="home-author">
            <AuthorPanel author={data.author} />
          </div>
        </div>
      </section>

      {isFocusMode ? (
        <CubeFocusHint
          previousMode={previousHomeMode}
          onExit={() =>
            dispatchHomeSceneIntent({
              type: "home-nav-click",
              origin: "ui",
              target: previousHomeMode,
            })
          }
        />
      ) : null}
    </main>
  );
}
