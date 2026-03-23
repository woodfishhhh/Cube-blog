"use client";

import { Post } from "@/lib/data";
import { useStore } from "@/store/store";

export function PostList({ posts }: { posts: Post[] }) {
  const enterReading = useStore((state) => state.enterReading);

  return (
    <div className="space-y-8 text-left">
      <h2 className="text-3xl font-light text-white mb-8 border-b border-white/20 pb-2">
        Recent Posts
      </h2>
      <div
        id="post-list-container"
        className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
        {posts.map((post, i) => (
          <article
            key={post.id}
            className="group cursor-pointer rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-white/10 hover:bg-white/[0.03] active:bg-white/[0.05]"
            onClick={() => enterReading(post.id)}>
            <div className="text-xs text-blue-400 mb-1">
              {new Date(post.date).toLocaleDateString()}
            </div>
            <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-300 transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
