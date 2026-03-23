"use client";

import { useStore } from "@/store/store";
import { PostList } from "./PostList";
import { AuthorProfile } from "./AuthorProfile";
import { FriendLinksPanel } from "./FriendLinksPanel";
import { AnimatePresence, motion } from "framer-motion";
import { AuthorInfo, FriendLink, Post } from "@/lib/data";
import { useEffect, useState } from "react";

export function UIOverlay({
  posts,
  authorInfo,
  friendLinks,
}: {
  posts: Post[];
  authorInfo: AuthorInfo;
  friendLinks: FriendLink[];
}) {
  const mode = useStore((state) => state.mode);
  const isFocusing = useStore((state) => state.isFocusing);
  const exitFocus = useStore((state) => state.exitFocus);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const cb = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex w-full h-full">
      <AnimatePresence mode="wait">
        {mode === "home" && !isFocusing && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="absolute bottom-8 w-full flex justify-center pointer-events-auto">
            <div className="animate-bounce text-gray-500 opacity-70 tracking-widest text-sm">
              ↓ 向下滑动，继续探索 ↓
            </div>
          </motion.div>
        )}

        {isFocusing && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="absolute bottom-8 w-full flex justify-center pointer-events-auto">
            <button
              onClick={exitFocus}
              className="animate-bounce text-white/50 hover:text-white transition-colors tracking-widest text-sm cursor-pointer z-50">
              沉浸模式，点此返回
            </button>
          </motion.div>
        )}

        {mode === "blog" && (
          <motion.div
            key="blog"
            initial={isMobile ? { opacity: 0, y: 50, x: 0 } : { opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={isMobile ? { opacity: 0, y: 50, x: 0 } : { opacity: 0, x: -100, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute left-0 bottom-0 md:top-0 h-[65vh] md:h-screen w-full md:w-1/2 flex items-start md:items-center p-6 pt-10 md:p-10 md:pl-20 pointer-events-auto bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/80 md:via-black/40 to-transparent">
            <div className="w-full h-full flex flex-col">
              <PostList posts={posts} />
            </div>
          </motion.div>
        )}

        {mode === "author" && (
          <motion.div
            key="author"
            initial={isMobile ? { opacity: 0, y: 50, x: 0 } : { opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={isMobile ? { opacity: 0, y: 50, x: 0 } : { opacity: 0, x: 100, y: 0 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="absolute right-0 bottom-0 md:top-0 h-[68vh] md:h-screen w-full md:w-1/2 flex items-start md:items-center p-6 pt-10 md:p-10 md:pr-20 pointer-events-auto bg-gradient-to-t md:bg-gradient-to-l from-black/95 via-black/80 md:via-black/40 to-transparent">
            <div className="w-full h-full flex items-center justify-center">
              <AuthorProfile info={authorInfo} />
            </div>
          </motion.div>
        )}

        {mode === "friend" && (
          <motion.div
            key="friend"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute left-0 bottom-0 w-full h-[62vh] md:h-[58vh] p-6 md:p-10 pointer-events-auto bg-gradient-to-t from-black/95 via-black/85 to-transparent">
            <FriendLinksPanel links={friendLinks} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
