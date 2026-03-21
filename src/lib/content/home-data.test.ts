import { describe, expect, it } from "vitest";

import { launchPostManifest } from "../../../content/launch-manifest";
import { getHomeData } from "@/lib/content/home-data";

describe("getHomeData", () => {
  it("preserves manifest order for homepage post cards", async () => {
    const data = await getHomeData();

    expect(data.posts.map((post) => post.slug)).toEqual(
      launchPostManifest.map((entry) => entry.slug),
    );
  });

  it("exposes a filtered author view model instead of raw import metadata", async () => {
    const data = await getHomeData();

    expect(data.author.displayName).toBe("木鱼");
    expect(data.author.headline).toContain("学生");
    expect(data.author.focusAreas.length).toBeGreaterThan(0);
    expect("source" in data.author).toBe(false);
  });
});
