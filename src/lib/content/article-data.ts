import type { ArticleData, ContentLookupResult } from "@/lib/content/types";
import { getMyBlogPosts } from "./myblog-loaders";

export type ArticleRouteParams = {
  slug: string;
};

export async function getArticleDataBySlug(
  slug: string,
): Promise<ContentLookupResult<ArticleData>> {
  const posts = await getMyBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return { ok: false, reason: "not-found" };
  }

  return {
    ok: true,
    value: {
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
      publishedLabel: post.publishedLabel,
      tags: post.tags,
      categories: post.categories,
      excerpt: post.excerpt,
      body: post.content,
    }
  };
}

export async function getArticleStaticParams(): Promise<ArticleRouteParams[]> {
  const posts = await getMyBlogPosts();
  return posts.map((entry) => ({ slug: entry.slug }));
}

export async function getAllArticleSlugs(): Promise<ArticleRouteParams[]> {
  return await getArticleStaticParams();
}
