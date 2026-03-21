import type { Object3D, Texture, WebGLRenderer } from "three";

type Disposable = {
  dispose: () => void;
};

type MaterialLike = {
  [key: string]: unknown;
};

type ObjectWithResources = Object3D & {
  geometry?: Disposable;
  material?: MaterialLike | MaterialLike[];
};

type SceneLike = Pick<Object3D, "traverse">;
type RendererLike = Pick<WebGLRenderer, "dispose">;

function isDisposable(value: unknown): value is Disposable {
  return typeof value === "object" && value !== null && "dispose" in value;
}

function disposeMaterial(material: MaterialLike) {
  for (const value of Object.values(material)) {
    if (isDisposable(value)) {
      (value as Texture).dispose();
    }
  }

  if (isDisposable(material)) {
    material.dispose();
  }
}

export function disposeSceneResources(scene: SceneLike, renderer: RendererLike) {
  scene.traverse((object) => {
    const resourceObject = object as ObjectWithResources;

    resourceObject.geometry?.dispose();

    if (Array.isArray(resourceObject.material)) {
      for (const material of resourceObject.material) {
        disposeMaterial(material);
      }

      return;
    }

    if (resourceObject.material) {
      disposeMaterial(resourceObject.material);
    }
  });

  renderer.dispose();
}
