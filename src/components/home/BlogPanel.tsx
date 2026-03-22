import { PostCard } from "@/components/home/PostCard";
import type { HomePostCardData } from "@/lib/content/types";

type BlogPanelProps = {
  posts: HomePostCardData[];
};

export function BlogPanel({ posts }: BlogPanelProps) {
  const formattedCount = String(posts.length).padStart(2, "0");

  return (
    <section
      className="content-panel content-panel--blog"
      aria-labelledby="home-blog-panel-title"
      data-home-scroll-panel="true"
      id="selected-writing"
    >
      <div className="content-panel__header content-panel__header--split">
        <div className="content-panel__heading">
          <p className="content-panel__eyebrow">Manifest order</p>
          <h2 className="content-panel__title" id="home-blog-panel-title">
            Selected Writing
          </h2>
          <p className="content-panel__lede">
            Curated launch posts surfaced with date marks and taxonomy cues in the DOM-first
            foreground shell.
          </p>
        </div>

        <p className="content-panel__index" aria-label={`${posts.length} curated posts`}>
          {formattedCount}
        </p>
      </div>

      <div className="content-panel__stack content-panel__stack--blog">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
