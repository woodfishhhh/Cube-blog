import type { HomeDisplayMode, SceneState } from "@/lib/scene/state-types";

export type SceneRouteMode =
  | { kind: "home" }
  | {
      kind: "article";
      slug: string;
    };

function normalizePathname(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

export function resolveSceneRouteMode(pathname: string): SceneRouteMode {
  const normalizedPathname = normalizePathname(pathname);
  const articleMatch = normalizedPathname.match(/^\/posts\/([^/]+)$/);

  if (articleMatch) {
    return {
      kind: "article",
      slug: articleMatch[1],
    };
  }

  return { kind: "home" };
}

export function resolveHomeSceneRestoreMode(
  sceneState: Pick<SceneState, "mode" | "lastHomeMode">,
): HomeDisplayMode {
  const restoreMode =
    sceneState.mode === "article-reading" || sceneState.mode === "home-cube-focus"
      ? sceneState.lastHomeMode
      : sceneState.mode;

  return restoreMode === "home-cube-focus" ? "home-hero" : restoreMode;
}
