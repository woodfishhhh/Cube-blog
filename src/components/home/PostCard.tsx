import Link from "next/link";

import type { HomePostCardData } from "@/lib/content/types";

type PostCardProps = {
  post: HomePostCardData;
  featured?: boolean;
};

function resolvePrimaryCategory(categories: string[]) {
  return categories.find((category) => category.trim().length > 0) ?? "Notes";
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const titleId = `post-card-title-${post.slug}`;
  const excerpt = post.excerpt.trim() || "Excerpt unavailable for this launch note yet.";
  const taxonomyItems = Array.from(
    new Set([...post.categories, ...post.tags].filter((item) => item.trim().length > 0)),
  );
  const primaryCategory = resolvePrimaryCategory(post.categories);

  return (
    <article
      className="post-card"
      aria-labelledby={titleId}
      data-post-emphasis={featured ? "lead" : "standard"}
      data-scene-interaction-block="true"
    >
      <div className="post-card__content">
        <div className="post-card__meta">
          <span className="post-card__meta-item">{post.publishedLabel}</span>
          <span aria-hidden="true" className="post-card__meta-separator">
            /
          </span>
          <span className="post-card__meta-item">{primaryCategory}</span>
        </div>

        <h3 className="post-card__title">
          <Link
            href={`/posts/${post.slug}`}
            id={titleId}
            data-scene-interaction-block="true"
            prefetch={false}
          >
            {post.title}
          </Link>
        </h3>

        <p className="post-card__excerpt">{excerpt}</p>
      </div>

      <ul className="post-card__taxonomies" aria-label={`${post.title} taxonomy`}>
        {(taxonomyItems.length > 0 ? taxonomyItems : ["Notes"]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
