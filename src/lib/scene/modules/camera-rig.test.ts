import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it, vi } from "vitest";

import { sceneBudgets } from "@/lib/scene/budgets";

describe("createCameraRig", () => {
  it("adds soft pointer parallax and can snap to a new rest pose without controls", async () => {
    const { createCameraRig } = await import("@/lib/scene/modules/camera-rig");
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    const lookAtSpy = vi.spyOn(camera, "lookAt");
    const pointer = { state: { x: 0.75, y: -0.5 } };
    const rig = createCameraRig({
      camera,
      defaultPosition: new Vector3(0, 0, 6),
      defaultTarget: new Vector3(0, 0, 0),
      pointer,
    });

    rig.update(1 / 60);

    expect(camera.position.x).toBeGreaterThan(0);
    expect(camera.position.y).toBeLessThan(0.1);
    expect(lookAtSpy).toHaveBeenCalled();

    rig.setRestPose(
      {
        position: new Vector3(0.5, 0.25, 5.5),
        target: new Vector3(0, 0.1, 0),
      },
      { snap: true },
    );

    expect(camera.position.x).toBeCloseTo(0.5);
    expect(camera.position.y).toBeCloseTo(0.25);
    expect(camera.position.z).toBeCloseTo(5.5);

    rig.applyState({
      mode: "home-author",
      lastHomeMode: "home-author",
      inputOwner: "none",
      activePointerId: null,
      activeArticleSlug: null,
    });

    for (let frame = 0; frame < 120; frame += 1) {
      rig.update(1 / 60);
    }

    expect(camera.position.x).toBeLessThan(-0.2);

    rig.dispose();

    const frozenPosition = camera.position.clone();

    rig.update(1 / 60);

    expect(camera.position.toArray()).toEqual(frozenPosition.toArray());
  });

  it("heavily damps idle drift and pointer parallax when reduced motion is requested", async () => {
    const { createCameraRig } = await import("@/lib/scene/modules/camera-rig");
    const basePointer = { state: { x: 0.9, y: -0.85 } };
    const fullMotionCamera = new PerspectiveCamera(45, 1, 0.1, 100);
    const reducedMotionCamera = new PerspectiveCamera(45, 1, 0.1, 100);
    const fullMotionRig = createCameraRig({
      camera: fullMotionCamera,
      pointer: basePointer,
    });
    const reducedMotionRig = createCameraRig({
      camera: reducedMotionCamera,
      pointer: basePointer,
      reducedMotion: true,
    } as Parameters<typeof createCameraRig>[0]);

    for (let frame = 0; frame < 120; frame += 1) {
      fullMotionRig.update(1 / 60);
      reducedMotionRig.update(1 / 60);
    }

    const fullMotionTravel = Math.abs(fullMotionCamera.position.x) + Math.abs(fullMotionCamera.position.y);
    const reducedMotionTravel =
      Math.abs(reducedMotionCamera.position.x) + Math.abs(reducedMotionCamera.position.y);

    expect(fullMotionTravel).toBeGreaterThan(0.15);
    expect(reducedMotionTravel).toBeGreaterThan(0);
    expect(reducedMotionTravel).toBeLessThan(fullMotionTravel * 0.4);
  });

  it("consumes lighter camera budgets for article-reading mobile than desktop home", async () => {
    const { createCameraRig } = await import("@/lib/scene/modules/camera-rig");
    const pointer = { state: { x: 0.9, y: -0.85 } };
    const desktopCamera = new PerspectiveCamera(45, 1, 0.1, 100);
    const articleMobileCamera = new PerspectiveCamera(45, 1, 0.1, 100);
    const desktopRig = createCameraRig({
      camera: desktopCamera,
      pointer,
    });
    const articleMobileRig = createCameraRig({
      camera: articleMobileCamera,
      pointer,
    } as Parameters<typeof createCameraRig>[0]);

    desktopRig.setBudget(sceneBudgets.home["desktop-default"]);
    articleMobileRig.setBudget(sceneBudgets["article-reading"].mobile);

    for (let frame = 0; frame < 120; frame += 1) {
      desktopRig.update(1 / 60);
      articleMobileRig.update(1 / 60);
    }

    const desktopTravel = Math.abs(desktopCamera.position.x) + Math.abs(desktopCamera.position.y);
    const articleMobileTravel =
      Math.abs(articleMobileCamera.position.x) + Math.abs(articleMobileCamera.position.y);

    expect(articleMobileTravel).toBeGreaterThan(0);
    expect(articleMobileTravel).toBeLessThan(desktopTravel * 0.25);
  });
});
