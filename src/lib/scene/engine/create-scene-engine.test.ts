import { describe, expect, it, vi } from "vitest";
import type { Object3D } from "three";

import { sceneBudgets } from "@/lib/scene/budgets";
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
  it("delegates cube stepping and actor lifecycle through injected scene modules", () => {
    const renderer = createRendererDouble();
    const cube = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      step: vi.fn(),
      update: vi.fn(),
    };
    const starfield = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      update: vi.fn(),
    };
    const cameraRig = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      setFocusDragOffset: vi.fn(),
      setReducedMotion: vi.fn(),
      update: vi.fn(),
    };
    const pointer = {
      dispose: vi.fn(),
      state: { x: 0, y: 0 },
    };
    const engine = createSceneEngine({
      createActors: () => ({ cameraRig, cube, pointer, starfield }),
      createCamera: createCameraDouble,
      createRenderer: () => renderer,
      createScene: createSceneDouble,
      requestAnimationFrame: vi.fn(() => 1),
      cancelAnimationFrame: vi.fn(),
      viewport: { devicePixelRatio: 1, innerHeight: 720, innerWidth: 1280 },
    });
    const host = document.createElement("div");
    const state = transitionSceneState(createInitialSceneState(), {
      type: "home-wheel-snapped",
      origin: "scene",
      direction: "forward",
    }).state;

    engine.mount(host);
    engine.applyState(state);
    engine.stepCube();
    engine.start();
    engine.dispose();

    expect(cube.applyState).toHaveBeenCalledWith(state);
    expect(starfield.applyState).toHaveBeenCalledWith(state);
    expect(cameraRig.applyState).toHaveBeenCalledWith(state);
    expect(cube.step).toHaveBeenCalledTimes(1);
    expect(cube.update).toHaveBeenCalledTimes(1);
    expect(starfield.update).toHaveBeenCalledTimes(1);
    expect(cameraRig.update).toHaveBeenCalledTimes(1);
    expect(starfield.setBudget).toHaveBeenCalledWith(sceneBudgets.home["desktop-default"]);
    expect(cube.setBudget).toHaveBeenCalledWith(sceneBudgets.home["desktop-default"]);
    expect(cameraRig.setBudget).toHaveBeenCalledWith(sceneBudgets.home["desktop-default"]);
    expect(pointer.dispose).toHaveBeenCalledTimes(1);
    expect(cube.dispose).toHaveBeenCalledTimes(1);
    expect(starfield.dispose).toHaveBeenCalledTimes(1);
    expect(cameraRig.dispose).toHaveBeenCalledTimes(1);
  });

  it("forwards explicit runtime budgets to the scene actors", () => {
    const renderer = createRendererDouble();
    const cube = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      step: vi.fn(),
      update: vi.fn(),
    };
    const starfield = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      update: vi.fn(),
    };
    const cameraRig = {
      applyState: vi.fn(),
      dispose: vi.fn(),
      setBudget: vi.fn(),
      setFocusDragOffset: vi.fn(),
      setReducedMotion: vi.fn(),
      update: vi.fn(),
    };
    const engine = createSceneEngine({
      createActors: () => ({
        cameraRig,
        cube,
        pointer: { dispose: vi.fn(), state: { x: 0, y: 0 } },
        starfield,
      }),
      createCamera: createCameraDouble,
      createRenderer: () => renderer,
      createScene: createSceneDouble,
      requestAnimationFrame: vi.fn(() => 1),
      cancelAnimationFrame: vi.fn(),
      viewport: { devicePixelRatio: 1, innerHeight: 720, innerWidth: 1280 },
    });

    engine.setBudget(sceneBudgets["article-reading"].mobile);

    expect(starfield.setBudget).toHaveBeenLastCalledWith(sceneBudgets["article-reading"].mobile);
    expect(cube.setBudget).toHaveBeenLastCalledWith(sceneBudgets["article-reading"].mobile);
    expect(cameraRig.setBudget).toHaveBeenLastCalledWith(sceneBudgets["article-reading"].mobile);
  });

  it("mounts exactly one persistent canvas and accepts external scene state updates", () => {
    const renderer = createRendererDouble();
    const engine = createSceneEngine({
      createActors: () => ({
        cameraRig: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          setFocusDragOffset: vi.fn(),
          setReducedMotion: vi.fn(),
          update: vi.fn(),
        },
        cube: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          step: vi.fn(),
          update: vi.fn(),
        },
        pointer: { dispose: vi.fn(), state: { x: 0, y: 0 } },
        starfield: { applyState: vi.fn(), dispose: vi.fn(), setBudget: vi.fn(), update: vi.fn() },
      }),
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
      createActors: () => ({
        cameraRig: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          setFocusDragOffset: vi.fn(),
          setReducedMotion: vi.fn(),
          update: vi.fn(),
        },
        cube: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          step: vi.fn(),
          update: vi.fn(),
        },
        pointer: { dispose: vi.fn(), state: { x: 0, y: 0 } },
        starfield: { applyState: vi.fn(), dispose: vi.fn(), setBudget: vi.fn(), update: vi.fn() },
      }),
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
      createActors: () => ({
        cameraRig: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          setFocusDragOffset: vi.fn(),
          setReducedMotion: vi.fn(),
          update: vi.fn(),
        },
        cube: {
          applyState: vi.fn(),
          dispose: vi.fn(),
          setBudget: vi.fn(),
          step: vi.fn(),
          update: vi.fn(),
        },
        pointer: { dispose: vi.fn(), state: { x: 0, y: 0 } },
        starfield: { applyState: vi.fn(), dispose: vi.fn(), setBudget: vi.fn(), update: vi.fn() },
      }),
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
