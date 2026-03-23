"use client";

import { useState } from "react";

import type { ArticleTocItem } from "@/lib/content/article-markdown-renderer";

type ArticleTocProps = {
  items: ArticleTocItem[];
};

export function ArticleToc({ items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  if (items.length === 0) {
    return null;
  }

  const handleJump = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    setActiveId(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside aria-label="文章目录" className="article-toc">
      <div className="article-toc__card">
        <div className="article-toc__title">文章目录</div>
        <div className="article-toc__items">
          {items.map((item) => (
            <button
              key={item.id}
              className={`article-toc__item article-toc__item--level-${item.level} ${activeId === item.id ? "is-active" : ""}`}
              onClick={() => handleJump(item.id)}
              type="button">
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
