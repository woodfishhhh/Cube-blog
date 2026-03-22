import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/article/ArticleView";
import {
  getArticleDataBySlug,
  getArticleStaticParams,
  type ArticleRouteParams,
} from "@/lib/content/article-data";

export const dynamicParams = true;

type PostPageProps = {
  params: Promise<ArticleRouteParams>;
};

export async function generateStaticParams() {
  return getArticleStaticParams();
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleDataBySlug(slug);

  if (!result.ok) {
    return {
      title: "Article not found | WOODFISH",
    };
  }

  return {
    title: `${result.value.title} | WOODFISH`,
    description: result.value.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const result = await getArticleDataBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  return (
    <main className="article-page">
      <ArticleView article={result.value} />
    </main>
  );
}
