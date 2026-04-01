"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/store";

export function SlideController({ children }: { children: React.ReactNode }) {
  const setMode = useStore((state) => state.setMode);

  const isAnimating = useRef(false);

  useEffect(() => {
    const getScrollBehavior = (behavior: ScrollBehavior = "smooth") =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : behavior;

    const scrollElement = (
      element: HTMLElement,
      top: number,
      behavior: ScrollBehavior = "smooth",
    ) => {
      element.scrollBy({ top, behavior: getScrollBehavior(behavior) });
    };

    const handleWheel = (e: WheelEvent) => {
      // Ignore if currently focusing on 3D or reading a post
      if (
        useStore.getState().isFocusing ||
        useStore.getState().mode === "reading"
      )
        return;

      if (isAnimating.current) return;

      const currentMode = useStore.getState().mode;

      if (currentMode === "friend") {
        const friendScroll = document.getElementById("friend-links-container");
        if (friendScroll) {
          e.preventDefault();
          scrollElement(friendScroll, e.deltaY);
          return;
        }
      }

      if (Math.abs(e.deltaY) > 30) {
        if (currentMode === "blog") {
          const list = document.getElementById("post-list-container");
          if (list) {
            // "无论我的鼠标在哪里，滑动的都应该是recentpost那一栏"
            if (e.deltaY < 0 && list.scrollTop <= 0) {
              setMode("home");
              isAnimating.current = true;
              setTimeout(() => {
                isAnimating.current = false;
              }, 1200);
            } else if (!e.composedPath().includes(list)) {
              // Preserve the same smooth feel even when the wheel starts outside the list.
              scrollElement(list, e.deltaY);
            }
            return;
          }
        }

        if (currentMode === "author") {
          const authorScroll = document.getElementById(
            "author-scroll-container",
          );
          if (authorScroll) {
            if (!e.composedPath().includes(authorScroll)) {
              scrollElement(authorScroll, e.deltaY);
            }
            return;
          }
        }

        if (e.deltaY > 0) {
          // Scroll down -> Next
          if (currentMode === "home") {
            setMode("blog");
            isAnimating.current = true;
            setTimeout(() => {
              isAnimating.current = false;
            }, 1200);
          }
        }
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Ignore if focusing or reading
      if (
        useStore.getState().isFocusing ||
        useStore.getState().mode === "reading"
      )
        return;

      if (isAnimating.current) return;
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      const currentMode = useStore.getState().mode;

      if (currentMode === "friend") {
        const friendScroll = document.getElementById("friend-links-container");
        if (friendScroll) {
          e.preventDefault();
          scrollElement(friendScroll, diff, "auto");
          touchStartY = touchEndY;
          return;
        }
      }

      if (Math.abs(diff) > 40) {
        // Threshold
        if (currentMode === "blog") {
          const list = document.getElementById("post-list-container");
          if (list) {
            if (diff < 0 && list.scrollTop <= 0) {
              setMode("home");
              isAnimating.current = true;
              setTimeout(() => {
                isAnimating.current = false;
              }, 1200);
            } else if (!e.composedPath().includes(list)) {
              scrollElement(list, diff, "auto");
              touchStartY = e.touches[0].clientY;
            }
            return;
          }
        }

        if (currentMode === "author") {
          const authorScroll = document.getElementById(
            "author-scroll-container",
          );
          if (authorScroll) {
            if (!e.composedPath().includes(authorScroll)) {
              scrollElement(authorScroll, diff, "auto");
              touchStartY = e.touches[0].clientY;
            }
            return;
          }
        }

        if (diff > 0) {
          // Swipe up -> Next slide
          if (currentMode === "home") {
            setMode("blog");
            isAnimating.current = true;
            setTimeout(() => {
              isAnimating.current = false;
            }, 1200);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [setMode]);

  return <>{children}</>;
}
