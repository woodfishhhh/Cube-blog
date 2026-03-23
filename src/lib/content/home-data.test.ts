import { beforeEach, describe, expect, it, vi } from "vitest";

type HomeDataModule = typeof import("@/lib/content/home-data");

const mockPosts = Array.from({ length: 12 }, (_, index) => ({
  slug: `post-${index + 1}`,
  title: `Post ${index + 1}`,
  publishedAt: `2026-03-${String(20 - index).padStart(2, "0")}T00:00:00.000Z`,
  publishedLabel: `Mar ${String(20 - index).padStart(2, "0")}, 2026`,
  tags: [`tag-${index + 1}`],
  categories: [`category-${index + 1}`],
  excerpt: `Excerpt ${index + 1}`,
  content: `Content ${index + 1}`,
}));

async function importHomeData(): Promise<HomeDataModule> {
  return import("@/lib/content/home-data");
}

beforeEach(() => {
  vi.resetModules();
  vi.doMock("@/lib/content/myblog-loaders", () => ({
    getMyBlogPosts: vi.fn().mockResolvedValue(mockPosts),
    getAuthorData: vi.fn().mockResolvedValue({
      displayName: "Woodfish",
      role: "Student builder",
      bio: "Building immersive study notes.",
    }),
  }));
});

describe("getHomeData", () => {
  it("keeps the newest ten mirrored posts for the homepage", async () => {
    const { getHomeData } = await importHomeData();
    const data = await getHomeData();

    expect(data.posts).toHaveLength(10);
    expect(data.posts.map((post) => post.slug)).toEqual(
      mockPosts.slice(0, 10).map((post) => post.slug),
    );
  });

  it("maps mirrored post metadata into homepage cards without reshaping it away", async () => {
    const { getHomeData } = await importHomeData();
    const data = await getHomeData();

    expect(data.posts[0]).toMatchObject({
      slug: "post-1",
      title: "Post 1",
      publishedLabel: "Mar 20, 2026",
      tags: ["tag-1"],
      categories: ["category-1"],
      excerpt: "Excerpt 1",
    });
  });

  it("builds the homepage author card from the mirrored author source plus project defaults", async () => {
    const { getHomeData } = await importHomeData();
    const data = await getHomeData();

    expect(data.author).toEqual({
      displayName: "Woodfish",
      introduction: "Building immersive study notes.",
      headline: "Student builder",
      slogan: "Deep space, quiet notes.",
      location: "Earth",
      occupation: "Student builder",
      university: "",
      major: "",
      profileTags: ["Three.js", "React", "Next.js", "WebGL"],
      focusAreas: ["Creative Coding", "Immersive Web", "Generative Art"],
      avatarUrl: "",
    });
  });

  it("keeps the current curated hero copy stable", async () => {
    const { getHomeData } = await importHomeData();
    const data = await getHomeData();

    expect(data.hero).toEqual({
      eyebrow: "Curated launch set",
      title: "WOODFISH immersive notes",
      summary:
        "A monochrome reading room for curated engineering notes, computer science study, and quietly atmospheric experimentation.",
    });
  });
});
