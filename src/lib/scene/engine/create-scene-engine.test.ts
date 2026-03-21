import { describe, expect, it, vi } from "vitest";
import type { Object3D } from "three";

import { createSceneEngine } from "@/lib/scene/engine/create-scene-engine";
import { createInitialSceneState, transitionSceneState } from "@/lib/scene/state-machine";

function setHostSize(host: HTMLElement, width: number, height: number) {
  Object.defineProperty(host, "clientWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(host, "clientHeight", {
    configurable: true,
    value: height,
  });
}

function createRendererDouble() {
  const domElement = document.createElement("canvas");

  domElement.dataset.sceneCanvas = "persistent";

  return {
    dispose: vi.fn(),
    domElement,
    render: vi.fn(),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
  };
}

function createCameraDouble() {
  return {
    aspect: 1,
    position: { x: 0, y: 0, z: 0 },
    updateProjectionMatrix: vi.fn(),
  };
}

function createSceneDouble() {
  return {
    traverse: vi.fn((visit: (object: Object3D) => void) => {
      void visit;
    }),
  };
}

describe("createSceneEngine", () => {
  it("mounts exactly one persistent canvas and accepts external scene state updates", () => {
    const renderer = createRendererDouble();
    const engine = createSceneEngine({
      createCamera: createCameraDouble,
      createRenderer: () => renderer,
      createScene: createSceneDouble,
      requestAnimationFrame: vi.fn(() => 1),
      cancelAnimationFrame: vi.fn(),
      viewport: { devicePixelRatio: 1, innerHeight: 720, innerWidth: 1280 },
    });
    const host = document.createElement("div");

    engine.mount(host);
    engine.mount(host);

    expect(host.querySelectorAll("canvas[data-scene-canvas='persistent']")).toHaveLength(1);

    const articleState = transitionSceneState(createInitialSceneState("home-blog"), {
      type: "article-entered",
      origin: "route",
      slug: "demo-post",
    }).state;

    engine.applyState(articleState);

    expect(host.dataset.sceneMode).toBe("article-reading");
    expect(renderer.domElement.dataset.sceneMode).toBe("article-reading");
  });

  it("centralizes resize updates for the renderer and camera", () => {
    const renderer = createRendererDouble();
    const camera = createCameraDouble();
    const engine = createSceneEngine({
      createCamera: () => camera,
      createRenderer: () => renderer,
      createScene: createSceneDouble,
      requestAnimationFrame: vi.fn(() => 1),
      cancelAnimationFrame: vi.fn(),
      viewport: { devicePixelRatio: 3, innerHeight: 720, innerWidth: 1280 },
    });
    const host = document.createElement("div");

    setHostSize(host, 960, 540);
    engine.mount(host);
    engine.resize();

    expect(renderer.setPixelRatio).toHaveBeenCalledWith(2);
    expect(renderer.setSize).toHaveBeenCalledWith(960, 540, false);
    expect(camera.aspect).toBe(960 / 540);
    expect(camera.updateProjectionMatrix).toHaveBeenCalledTimes(1);
    expect(renderer.render).toHaveBeenCalledTimes(1);
  });

  it("stops the frame loop and disposes scene resources cleanly", () => {
    const renderer = createRendererDouble();
    const geometryDispose = vi.fn();
    const textureDispose = vi.fn();
    const materialDispose = vi.fn();
    const requestAnimationFrame = vi.fn(() => 7);
    const cancelAnimationFrame = vi.fn();
    const engine = createSceneEngine({
      createCamera: createCameraDouble,
      createRenderer: () => renderer,
      createScene: () => ({
        traverse: (visit: (object: Object3D) => void) => {
          visit({
            geometry: { dispose: geometryDispose },
            material: {
              alphaMap: { dispose: textureDispose },
              dispose: materialDispose,
            },
          } as unknown as Object3D);
        },
      }),
      requestAnimationFrame,
      cancelAnimationFrame,
      viewport: { devicePixelRatio: 1, innerHeight: 720, innerWidth: 1280 },
    });
    const host = document.createElement("div");

    engine.mount(host);
    engine.start();

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(renderer.render).toHaveBeenCalledTimes(1);

    engine.stop();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(7);

    engine.dispose();

    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(textureDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).toHaveBeenCalledTimes(1);
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(host.querySelectorAll("canvas")).toHaveLength(0);
  });
});
