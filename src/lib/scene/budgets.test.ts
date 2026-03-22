import { describe, expect, it } from "vitest";

import { resolveSceneBudget, sceneBudgets } from "@/lib/scene/budgets";

describe("scene budgets", () => {
  it("exports an explicit budget matrix for home, article-reading, and disabled scene states", () => {
    expect(sceneBudgets.home["desktop-default"]).toEqual({
      cameraAmbientMotionScale: 1,
      cameraParallaxScale: 1,
      cubeAmbientMotionScale: 1,
      starfieldCount: 160,
    });

    expect(sceneBudgets.home["reduced-motion"]).toEqual({
      cameraAmbientMotionScale: 0.18,
      cameraParallaxScale: 0.2,
      cubeAmbientMotionScale: 0.2,
      starfieldCount: 96,
    });

    expect(sceneBudgets.disabled).toEqual({
      cameraAmbientMotionScale: 0,
      cameraParallaxScale: 0,
      cubeAmbientMotionScale: 0,
      starfieldCount: 0,
    });
  });

  it("keeps article-reading and constrained tiers lighter than the desktop home default", () => {
    const desktopHomeBudget = sceneBudgets.home["desktop-default"];
    const desktopArticleBudget = sceneBudgets["article-reading"]["desktop-default"];
    const mobileHomeBudget = sceneBudgets.home.mobile;

    expect(desktopArticleBudget.starfieldCount).toBeLessThan(desktopHomeBudget.starfieldCount);
    expect(desktopArticleBudget.cubeAmbientMotionScale).toBeLessThan(
      desktopHomeBudget.cubeAmbientMotionScale,
    );
    expect(desktopArticleBudget.cameraParallaxScale).toBeLessThan(
      desktopHomeBudget.cameraParallaxScale,
    );

    expect(mobileHomeBudget.starfieldCount).toBeLessThan(desktopHomeBudget.starfieldCount);
    expect(mobileHomeBudget.cameraAmbientMotionScale).toBeLessThan(
      desktopHomeBudget.cameraAmbientMotionScale,
    );
  });

  it("resolves live, reduced, mobile, article, and disabled budget requests through one helper", () => {
    expect(
      resolveSceneBudget({
        reducedMotion: false,
        sceneEnabled: true,
        sceneMode: "home-blog",
        touchLayout: false,
      }),
    ).toBe(sceneBudgets.home["desktop-default"]);

    expect(
      resolveSceneBudget({
        reducedMotion: true,
        sceneEnabled: true,
        sceneMode: "home-author",
        touchLayout: false,
      }),
    ).toBe(sceneBudgets.home["reduced-motion"]);

    expect(
      resolveSceneBudget({
        reducedMotion: false,
        sceneEnabled: true,
        sceneMode: "home-hero",
        touchLayout: true,
      }),
    ).toBe(sceneBudgets.home.mobile);

    expect(
      resolveSceneBudget({
        reducedMotion: false,
        sceneEnabled: true,
        sceneMode: "article-reading",
        touchLayout: false,
      }),
    ).toBe(sceneBudgets["article-reading"]["desktop-default"]);

    expect(
      resolveSceneBudget({
        reducedMotion: false,
        sceneEnabled: false,
        sceneMode: "home-cube-focus",
        touchLayout: false,
      }),
    ).toBe(sceneBudgets.disabled);
  });
});
