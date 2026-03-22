import { formatPublishedDate } from "@/lib/content/date";
import { loadLaunchPostSource, type LaunchPostSourcePayload, listLaunchPosts } from "@/lib/content/loaders";
import { parseMarkdownDocument } from "@/lib/content/markdown";
import type { ArticleData, ContentLookupResult } from "@/lib/content/types";

export type ArticleRouteParams = {
  slug: string;
};

export async function getArticleDataBySlug(
  slug: string,
): Promise<ContentLookupResult<ArticleData>> {
  const result = await loadLaunchPostSource(slug);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    value: mapLaunchPostToArticle(result.value),
  };
}

export function getArticleStaticParams(): ArticleRouteParams[] {
  return listLaunchPosts().map((entry) => ({ slug: entry.slug }));
}

export function getAllArticleSlugs(): ArticleRouteParams[] {
  return getArticleStaticParams();
}

function mapLaunchPostToArticle(payload: LaunchPostSourcePayload): ArticleData {
  const parsed = parseMarkdownDocument(payload.raw);

  return {
    slug: payload.entry.slug,
    title: parsed.frontmatter.title,
    publishedAt: parsed.frontmatter.date,
    publishedLabel: formatPublishedDate(parsed.frontmatter.date),
    tags: parsed.frontmatter.tags,
    categories: parsed.frontmatter.categories,
    excerpt: parsed.excerpt,
    body: parsed.body,
  };
}
