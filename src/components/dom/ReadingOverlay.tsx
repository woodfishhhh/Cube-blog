"use client";

import { useStore } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Post } from "@/lib/data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ReadingOverlay({ posts }: { posts: Post[] }) {
  const activePostId = useStore((state) => state.activePostId);
  const mode = useStore((state) => state.mode);
  const goBlog = useStore((state) => state.goBlog);

  const post = posts.find((p) => p.id === activePostId);

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
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl p-6 md:p-20">
          <button
            onClick={goBlog}
            className="fixed top-8 right-8 text-white/50 hover:text-white transition-colors z-50 text-xl">
            ✕ CLOSE
          </button>

          <article className="max-w-3xl mx-auto mt-10 pb-20 prose prose-invert prose-lg">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              {post.title}
            </h1>
            <div className="flex gap-4 text-sm text-gray-400 mb-10">
              <time>{new Date(post.date).toLocaleDateString()}</time>
              <div className="flex gap-2">
                {post.tags.map((t: string) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </div>

            <div className="text-gray-300 font-light leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
