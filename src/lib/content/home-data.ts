import type {
  HomeAuthorData,
  HomeHeroData,
  HomePageData,
  HomePostCardData,
} from "@/lib/content/types";

import { getMyBlogPosts, getAuthorData } from "./myblog-loaders";

const defaultHero: HomeHeroData = {
  eyebrow: "Curated launch set",
  title: "WOODFISH immersive notes",
  summary:
    "A monochrome reading room for curated engineering notes, computer science study, and quietly atmospheric experimentation.",
};

export async function getHomeData(): Promise<HomePageData> {
  const allPosts = await getMyBlogPosts();
  const posts: HomePostCardData[] = allPosts.slice(0, 10).map((post) => ({
    slug: post.slug,
    title: post.title,
    publishedAt: post.publishedAt,
    publishedLabel: post.publishedLabel,
    tags: post.tags,
    categories: post.categories,
    excerpt: post.excerpt,
  }));

  const authorDataRaw = await getAuthorData();

  const author: HomeAuthorData = {
    displayName: authorDataRaw.displayName,
    introduction: authorDataRaw.bio,
    headline: authorDataRaw.role,
    slogan: "Deep space, quiet notes.",
    location: "Earth",
    occupation: authorDataRaw.role,
    university: "",
    major: "",
    profileTags: ["Three.js", "React", "Next.js", "WebGL"],
    focusAreas: ["Creative Coding", "Immersive Web", "Generative Art"],
    avatarUrl: ""
  };

  return {
    hero: defaultHero,
    posts,
    author,
  };
}
