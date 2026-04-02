import { extractArticleToc } from "@/lib/content/article-markdown-renderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { ArticleToc } from "./ArticleToc";
import type { ArticleData } from "@/lib/content/types";

type ArticleViewProps = {
  article: ArticleData;
};

export function ArticleView({ article }: ArticleViewProps) {
  const normalizedBody = removeDuplicateTitleHeading(article.body, article.title);
  const tocItems = extractArticleToc(normalizedBody);
  const articleTitleId = `article-title-${article.slug}`;
  const metadataItems = [
    { label: "Published", value: article.publishedLabel },
    { label: "Category", value: resolvePrimaryCategory(article.categories) },
    { label: "Tags", value: resolveTagSummary(article.tags) },
  ];

  return (
    <article aria-labelledby={articleTitleId} className="article-view">
      <header className="article-view__header">
        <div className="article-view__masthead">
          <p className="article-view__eyebrow">Curated article</p>
          <h1 className="article-view__title" id={articleTitleId}>
            {article.title}
          </h1>
        </div>

        <div className="article-view__intro">
          <p className="article-view__excerpt">{article.excerpt}</p>
          <div className="article-view__meta" aria-label="Article metadata">
            {metadataItems.map((item) => (
              <span className="article-view__meta-item" key={item.label}>
                <span className="article-view__meta-label">{item.label}</span>
                <span className="article-view__meta-value">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="article-view__layout">
        <div className="article-markdown-shell article-view__content">
          <div
            aria-label={`${article.title} content`}
            className="article-markdown"
            id="article-container"
            role="region"
            tabIndex={-1}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
            >
              {normalizedBody}
            </ReactMarkdown>
          </div>
        </div>
        <ArticleToc items={tocItems} />
      </div>
    </article>
  );
}

function resolvePrimaryCategory(categories: string[]) {
  return categories.find((category) => category.trim().length > 0) ?? "Notes";
}

function resolveTagSummary(tags: string[]) {
  return tags.filter((tag) => tag.trim().length > 0).slice(0, 3).join(" / ") || "No tags";
}

function removeDuplicateTitleHeading(body: string, title: string) {
  const match = body.match(/^#\s+(.+?)\r?\n+/);

  if (!match) {
    return body;
  }

  const headingText = match[1].trim();

  if (headingText !== title.trim()) {
    return body;
  }

  return body.slice(match[0].length).trimStart();
}
