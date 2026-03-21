import type { PerspectiveCamera, WebGLRenderer } from "three";

type ViewportLike = Pick<Window, "devicePixelRatio" | "innerHeight" | "innerWidth">;

type RendererLike = Pick<WebGLRenderer, "setPixelRatio" | "setSize">;
type CameraLike = Pick<PerspectiveCamera, "aspect" | "updateProjectionMatrix">;

export type SceneHostSize = {
  width: number;
  height: number;
};

type ResizeSceneOptions = {
  camera: CameraLike;
  devicePixelRatio?: number;
  maxPixelRatio?: number;
  renderer: RendererLike;
  size: SceneHostSize;
};

const minimumSceneSize = 1;

export function measureSceneHost(
  host: HTMLElement,
  viewport: ViewportLike,
): SceneHostSize {
  return {
    width: Math.max(minimumSceneSize, host.clientWidth || viewport.innerWidth),
    height: Math.max(minimumSceneSize, host.clientHeight || viewport.innerHeight),
  };
}

export function resizeSceneRenderer({
  camera,
  devicePixelRatio = 1,
  maxPixelRatio = 2,
  renderer,
  size,
}: ResizeSceneOptions): SceneHostSize & { pixelRatio: number } {
  const pixelRatio = Math.min(devicePixelRatio, maxPixelRatio);

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(size.width, size.height, false);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  return {
    ...size,
    pixelRatio,
  };
}
