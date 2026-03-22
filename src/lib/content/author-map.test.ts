import { describe, expect, it } from "vitest";

import { mapAuthorProfileToHomeAuthorData } from "@/lib/content/author-map";
import type { NormalizedAuthorProfile } from "@/lib/content/types";

describe("mapAuthorProfileToHomeAuthorData", () => {
  it("trims text, dedupes lists, and drops raw author fields outside the homepage contract", () => {
    const author = {
      displayName: "  Woodfish  ",
      introduction: "  Building quietly  ",
      headline: "  Student builder  ",
      slogan: "  Keep shipping  ",
      location: "  Nanchang  ",
      occupation: "  Student  ",
      university: "  JUFE  ",
      major: "  Computer Science  ",
      avatarUrl: "  https://example.com/avatar.png  ",
      profileTags: [" Builder ", "Builder", "", " Systems ", "Systems"],
      focusAreas: [" Interaction ", "", "Interaction", " Graphics "],
      source: {
        sourceRoot: "blog",
        sourcePath: "source/_data/about.yml",
      },
      siteTitle: "Ignored site title",
      birthYear: 2006,
      raw: {
        nested: true,
      },
    } as NormalizedAuthorProfile & {
      siteTitle: string;
      birthYear: number;
      raw: { nested: boolean };
    };

    const mapped = mapAuthorProfileToHomeAuthorData(author);

    expect(mapped).toEqual({
      displayName: "Woodfish",
      introduction: "Building quietly",
      headline: "Student builder",
      slogan: "Keep shipping",
      location: "Nanchang",
      occupation: "Student",
      university: "JUFE",
      major: "Computer Science",
      avatarUrl: "https://example.com/avatar.png",
      profileTags: ["Builder", "Systems"],
      focusAreas: ["Interaction", "Graphics"],
    });
    expect(mapped).not.toHaveProperty("source");
    expect(mapped).not.toHaveProperty("siteTitle");
    expect(mapped).not.toHaveProperty("birthYear");
    expect(mapped).not.toHaveProperty("raw");
  });

  it("omits blank optional metadata while preserving normalized required fields", () => {
    const mapped = mapAuthorProfileToHomeAuthorData({
      displayName: "  木鱼  ",
      introduction: "   ",
      headline: "",
      slogan: " ",
      location: " ",
      occupation: "",
      university: " ",
      major: "",
      avatarUrl: "   ",
      profileTags: ["", "  "],
      focusAreas: ["", "  "],
      source: {
        sourceRoot: "blog",
        sourcePath: "source/_data/about.yml",
      },
    });

    expect(mapped).toEqual({
      displayName: "木鱼",
      profileTags: [],
      focusAreas: [],
    });
  });
});
