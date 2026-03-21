import { readFile } from "node:fs/promises";
import path from "node:path";

import { formatPublishedDate } from "@/lib/content/date";
import { listLaunchPosts, loadLaunchPostSource } from "@/lib/content/loaders";
import { parseMarkdownDocument } from "@/lib/content/markdown";
import type {
  HomeAuthorData,
  HomeHeroData,
  HomePageData,
  HomePostCardData,
  NormalizedAuthorProfile,
} from "@/lib/content/types";

const authorProfilePath = path.resolve(process.cwd(), "content", "author", "profile.json");

const defaultHero: HomeHeroData = {
  eyebrow: "Curated launch set",
  title: "WOODFISH immersive notes",
  summary:
    "A monochrome reading room for curated engineering notes, computer science study, and quietly atmospheric experimentation.",
};

export async function getHomeData(): Promise<HomePageData> {
  const [author, posts] = await Promise.all([
    loadAuthorData(),
    Promise.all(listLaunchPosts().map((entry) => loadPostCardData(entry.slug))),
  ]);

  return {
    hero: defaultHero,
    posts,
    author,
  };
}

async function loadPostCardData(slug: string): Promise<HomePostCardData> {
  const result = await loadLaunchPostSource(slug);

  if (!result.ok) {
    throw new Error(`Expected imported launch content for "${slug}", received ${result.reason}.`);
  }

  const parsed = parseMarkdownDocument(result.value.raw);

  return {
    slug,
    title: parsed.frontmatter.title,
    publishedAt: parsed.frontmatter.date,
    publishedLabel: formatPublishedDate(parsed.frontmatter.date),
    tags: parsed.frontmatter.tags,
    categories: parsed.frontmatter.categories,
    excerpt: parsed.excerpt,
  };
}

async function loadAuthorData(): Promise<HomeAuthorData> {
  const rawProfile = await readFile(authorProfilePath, "utf8");
  const author = JSON.parse(rawProfile) as NormalizedAuthorProfile;

  return {
    displayName: author.displayName,
    introduction: author.introduction,
    headline: author.headline,
    slogan: author.slogan,
    location: author.location,
    occupation: author.occupation,
    university: author.university,
    major: author.major,
    profileTags: author.profileTags,
    focusAreas: author.focusAreas,
    avatarUrl: author.avatarUrl,
  };
}
