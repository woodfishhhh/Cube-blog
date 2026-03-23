"use client";

import { useStore } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ReadingOverlay() {
  const activePostId = useStore((state) => state.activePostId);
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);

  // We need to fetch the content or pass it.
  // Since we don't have a content API handy in client component easily without prop drilling everything,
  // we will hack it: re-fetch from a server action or just pass all posts to a store?
  // Better: The store only holds ID. We need the content.
  // For this prototype, I'll cheat and fetch from a client-side parsed map if possible.
  // actually, let's just make `PostList` pass the content to store? No, that's heavy.
  // We'll create a simple server action or API route.
  // OR: Just keep it simple. Pass `posts` to Layout, Layout passes to `ReadingOverlay`.

  // But Abstracting: Let's assume we have the content available or we can fetch it.
  // I will implement a client-side find since we have the list in `PostList` which is client side?
  // No, `PostList` received posts from server.

  // Let's modify the props of ReadingOverlay to accept posts?
  // But Layout renders it.
  // I will modify `src/app/layout.tsx` to pass posts to `ReadingOverlay` as well.

  const [post, setPost] = useState<any>(null);

  // This is a placeholder hook logic since I can't easily modify the layout to pass props right now without rewriting it.
  // I'll make this component accept `posts` as prop.
  return null;
}
