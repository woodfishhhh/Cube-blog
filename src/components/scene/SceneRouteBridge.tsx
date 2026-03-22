"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { dispatchHomeSceneIntent } from "@/components/home/use-home-scene-controller";
import {
  resolveSceneRouteMode,
  type SceneRouteMode,
} from "@/lib/scene/route-mode";

function isSameRouteMode(previousMode: SceneRouteMode | null, nextMode: SceneRouteMode) {
  if (previousMode === null || previousMode.kind !== nextMode.kind) {
    return false;
  }

  if (previousMode.kind === "article" && nextMode.kind === "article") {
    return previousMode.slug === nextMode.slug;
  }

  return true;
}

export function SceneRouteBridge() {
  const pathname = usePathname();
  const previousRouteModeRef = useRef<SceneRouteMode | null>(null);

  useEffect(() => {
    const nextRouteMode = resolveSceneRouteMode(pathname);
    const previousRouteMode = previousRouteModeRef.current;

    if (isSameRouteMode(previousRouteMode, nextRouteMode)) {
      return;
    }

    if (nextRouteMode.kind === "article") {
      dispatchHomeSceneIntent({
        type: "article-route-change",
        origin: "route",
        phase: "enter",
        slug: nextRouteMode.slug,
      });
    } else if (previousRouteMode?.kind === "article") {
      dispatchHomeSceneIntent({
        type: "article-route-change",
        origin: "route",
        phase: "exit",
      });
    }

    previousRouteModeRef.current = nextRouteMode;
  }, [pathname]);

  return null;
}
