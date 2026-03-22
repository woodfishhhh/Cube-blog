import { Scene, Vector3 } from "three";
import { describe, expect, it } from "vitest";

import { sceneBudgets } from "@/lib/scene/budgets";

describe("createFloatingCube", () => {
  it("creates a floating cube with a deterministic step hook and anchor recentering", async () => {
    const { createFloatingCube } = await import("@/lib/scene/modules/cube");
    const scene = new Scene();
    const cube = createFloatingCube({ scene });

    expect(scene.children).toContain(cube.root);
    expect(cube.getStepIndex()).toBe(0);

    cube.update(1 / 60, 0);

    expect(cube.mesh.rotation.x).toBeLessThan(-0.1);
    expect(cube.mesh.rotation.y).toBeGreaterThan(0.2);

    const faceMaterial = cube.mesh.material as unknown as {
      color: { getHexString: () => string };
      opacity: number;
    };

    expect(faceMaterial.color.getHexString()).toBe("2a2a2a");
    expect(faceMaterial.opacity).toBeGreaterThanOrEqual(0.96);

    cube.step();
    cube.step();

    expect(cube.getStepIndex()).toBe(2);

    for (let frame = 0; frame < 90; frame += 1) {
      cube.update(1 / 60, frame / 60);
    }

    expect(cube.mesh.rotation.y).toBeGreaterThan(1.2);

    cube.setAnchor(new Vector3(1.25, 0.3, -0.2), { snap: true });

    expect(cube.root.position.x).toBeCloseTo(1.25);
    expect(cube.root.position.y).toBeCloseTo(0.3);
    expect(cube.root.position.z).toBeCloseTo(-0.2);

    cube.setAnchor(new Vector3(0, 0, 0), { snap: true });

    cube.applyState({
      mode: "home-blog",
      lastHomeMode: "home-blog",
      inputOwner: "none",
      activePointerId: null,
      activeArticleSlug: null,
    });

    for (let frame = 0; frame < 90; frame += 1) {
      cube.update(1 / 60, frame / 60);
    }

    expect(cube.root.position.x).toBeGreaterThan(0.8);

    cube.dispose();

    expect(scene.children).not.toContain(cube.root);
  });

  it("keeps the cube readable with calmer idle float and tilt under reduced motion", async () => {
    const { createFloatingCube } = await import("@/lib/scene/modules/cube");
    const fullMotionScene = new Scene();
    const reducedMotionScene = new Scene();
    const fullMotionCube = createFloatingCube({ scene: fullMotionScene });
    const reducedMotionCube = createFloatingCube({
      scene: reducedMotionScene,
      reducedMotion: true,
    } as Parameters<typeof createFloatingCube>[0]);

    for (let frame = 0; frame < 120; frame += 1) {
      const elapsedSeconds = frame / 60;

      fullMotionCube.update(1 / 60, elapsedSeconds);
      reducedMotionCube.update(1 / 60, elapsedSeconds);
    }

    const fullMotionYOffset = Math.abs(fullMotionCube.root.position.y - 0.05);
    const reducedMotionYOffset = Math.abs(reducedMotionCube.root.position.y - 0.05);
    const fullMotionTilt = Math.abs(fullMotionCube.mesh.rotation.x + 0.46);
    const reducedMotionTilt = Math.abs(reducedMotionCube.mesh.rotation.x + 0.46);

    expect(fullMotionYOffset).toBeGreaterThan(0.04);
    expect(reducedMotionYOffset).toBeLessThan(fullMotionYOffset * 0.4);
    expect(reducedMotionTilt).toBeLessThan(fullMotionTilt * 0.4);
  });

  it("uses lighter ambient motion budgets for article-reading and mobile tiers than desktop home", async () => {
    const { createFloatingCube } = await import("@/lib/scene/modules/cube");
    const desktopScene = new Scene();
    const articleMobileScene = new Scene();
    const desktopCube = createFloatingCube({ scene: desktopScene });
    const articleMobileCube = createFloatingCube({ scene: articleMobileScene });

    desktopCube.setBudget(sceneBudgets.home["desktop-default"]);
    articleMobileCube.setBudget(sceneBudgets["article-reading"].mobile);

    for (let frame = 0; frame < 120; frame += 1) {
      const elapsedSeconds = frame / 60;

      desktopCube.update(1 / 60, elapsedSeconds);
      articleMobileCube.update(1 / 60, elapsedSeconds);
    }

    const desktopYOffset = Math.abs(desktopCube.root.position.y - 0.05);
    const articleMobileYOffset = Math.abs(articleMobileCube.root.position.y - 0.05);
    const desktopTilt = Math.abs(desktopCube.mesh.rotation.x + 0.46);
    const articleMobileTilt = Math.abs(articleMobileCube.mesh.rotation.x + 0.46);

    expect(articleMobileYOffset).toBeLessThan(desktopYOffset * 0.5);
    expect(articleMobileTilt).toBeLessThan(desktopTilt * 0.5);
  });
});
