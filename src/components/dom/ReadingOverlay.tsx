"use client";

import { useStore } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Post } from "@/lib/data";
import { extractArticleToc } from "@/lib/content/article-markdown-renderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { ArticleToc } from "@/components/article/ArticleToc";

export function ReadingOverlay({ posts }: { posts: Post[] }) {
  const activePostId = useStore((state) => state.activePostId);
  const mode = useStore((state) => state.mode);
  const goBlog = useStore((state) => state.goBlog);

  const post = posts.find((p) => p.id === activePostId);
  const tocItems = post ? extractArticleToc(post.content) : [];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === "reading") goBlog();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mode, goBlog]);

  return (
    <AnimatePresence>
      {mode === "reading" && post && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="article-overlay-scroll-root fixed inset-0 z-50 overflow-y-auto bg-[rgba(5,5,16,0.34)] backdrop-blur-sm p-6 md:p-20">
          <button
            onClick={goBlog}
            className="fixed top-8 right-8 text-white/50 hover:text-white transition-colors z-50 text-xl">
            ✕ CLOSE
          </button>

          <article className="article-view article-view--overlay max-w-5xl mx-auto mt-10 pb-20">
            <header className="article-view__header">
              <div className="article-view__masthead">
                <p className="article-view__eyebrow">Immersive reading</p>
                <h1 className="article-view__title">
                  {post.title}
                </h1>
              </div>
              <div className="article-view__intro">
                <p className="article-view__excerpt">{post.excerpt}</p>
                <div className="article-view__meta" aria-label="Article metadata">
                  <span className="article-view__meta-item">
                    <span className="article-view__meta-label">Published</span>
                    <time className="article-view__meta-value">
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                  </span>
                  <span className="article-view__meta-item">
                    <span className="article-view__meta-label">Tags</span>
                    <span className="article-view__meta-value">{post.tags.join(" / ")}</span>
                  </span>
                </div>
              </div>
            </header>

            <div className="article-view__layout">
              <div className="article-markdown-shell article-view__content">
                <div
                  aria-label={`${post.title} content`}
                  className="article-markdown"
                  id="article-container"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
              <ArticleToc items={tocItems} />
            </div>
          </article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
