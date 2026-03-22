import { readFile } from "node:fs/promises";
import path from "node:path";

import { mapAuthorProfileToHomeAuthorData } from "@/lib/content/author-map";
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
  const launchEntries = listLaunchPosts();
  const [author, posts] = await Promise.all([loadAuthorData(), loadOrderedHomePostCards(launchEntries)]);

  return {
    hero: defaultHero,
    posts,
    author,
  };
}

async function loadOrderedHomePostCards(entries: readonly { slug: string }[]): Promise<HomePostCardData[]> {
  return Promise.all(entries.map((entry) => loadPostCardData(entry.slug)));
}

async function loadPostCardData(slug: string): Promise<HomePostCardData> {
  const result = await loadLaunchPostSource(slug);

  if (!result.ok) {
    throw new Error(`Expected imported launch content for "${slug}", received ${result.reason}.`);
  }

  const parsed = parseMarkdownDocument(result.value.raw);
  const tags = normalizeTextList(parsed.frontmatter.tags);
  const categories = normalizeTextList(parsed.frontmatter.categories);

  return {
    slug,
    title: parsed.frontmatter.title,
    publishedAt: parsed.frontmatter.date,
    publishedLabel: formatPublishedDate(parsed.frontmatter.date),
    tags,
    categories,
    excerpt: parsed.excerpt,
  };
}

async function loadAuthorData(): Promise<HomeAuthorData> {
  const rawProfile = await readFile(authorProfilePath, "utf8");
  const author = JSON.parse(rawProfile) as NormalizedAuthorProfile;

  return mapAuthorProfileToHomeAuthorData(author);
}

function normalizeTextList(values: readonly string[]): string[] {
  const normalizedValues = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return Array.from(new Set(normalizedValues));
}
