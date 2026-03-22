"use client";

import dynamic from "next/dynamic";

const LazySceneViewport = dynamic(
  () => import("@/components/scene/SceneViewport").then((module) => module.SceneViewport),
  {
    ssr: false,
    loading: () => null,
  },
);

export function SceneViewportSlot() {
  return <LazySceneViewport />;
}
