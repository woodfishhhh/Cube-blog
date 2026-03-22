import { Scene } from "three";
import { describe, expect, it } from "vitest";

import { sceneBudgets } from "@/lib/scene/budgets";

type DrawRangeGeometry = {
  drawRange: {
    count: number;
  };
};

describe("createStarfield", () => {
  it("creates a lightweight monochrome starfield and disposes it cleanly", async () => {
    const { createStarfield } = await import("@/lib/scene/modules/starfield");
    const scene = new Scene();
    const starfield = createStarfield({ count: 48, scene, seed: 7 });

    expect(scene.children).toContain(starfield.points);
    expect(starfield.points.geometry.getAttribute("position").count).toBe(48);
    expect(starfield.material.color.getHexString()).toBe("ffffff");

    starfield.dispose();

    expect(scene.children).not.toContain(starfield.points);
  });

  it("reduces active star count when a lower runtime budget is applied", async () => {
    const { createStarfield } = await import("@/lib/scene/modules/starfield");
    const scene = new Scene();
    const starfield = createStarfield({ scene });
    const geometry = starfield.points.geometry as typeof starfield.points.geometry & DrawRangeGeometry;

    starfield.setBudget(sceneBudgets.home["desktop-default"]);

    expect(geometry.drawRange.count).toBe(
      sceneBudgets.home["desktop-default"].starfieldCount,
    );

    starfield.setBudget(sceneBudgets["article-reading"].mobile);

    expect(geometry.drawRange.count).toBe(
      sceneBudgets["article-reading"].mobile.starfieldCount,
    );
    expect(geometry.drawRange.count).toBeLessThan(
      sceneBudgets.home["desktop-default"].starfieldCount,
    );
  });
});
