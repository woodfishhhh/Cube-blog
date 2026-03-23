"use client";

import { useStore } from "@/store/store";
import { motion } from "framer-motion";

export function Navigation() {
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);
  const exitFocus = useStore((state) => state.exitFocus);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
      <div
        className="text-xl font-bold tracking-widest text-white pointer-events-auto cursor-pointer mix-blend-difference"
        onClick={() => {
          setMode("home");
          exitFocus();
        }}>
        WOODFISH
      </div>

      <div className="flex gap-8 pointer-events-auto">
        <button
          onClick={() => {
            setMode("blog");
            exitFocus();
            // We might need to handle scrolling here too?
            // The 3D scene follows scroll, but if we click nav, we should scroll the page?
            // Since ScrollControls manages scroll, we might need a reference to scroll.
            // But for now, let's just update mode and let the user scroll or implement scroll sync later.
            const vh = window.innerHeight;
            const el =
              document.querySelector("main")?.parentElement?.parentElement; // wrapper of scroll
            if (el) el.scrollTo({ top: vh * 1, behavior: "smooth" });
          }}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "blog" ? "text-blue-400" : "text-gray-400"}`}>
          Blog
        </button>
        <button
          onClick={() => {
            setMode("author");
            exitFocus();
            const vh = window.innerHeight;
            const el =
              document.querySelector("main")?.parentElement?.parentElement;
            if (el) el.scrollTo({ top: vh * 2, behavior: "smooth" });
          }}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "author" ? "text-blue-400" : "text-gray-400"}`}>
          Author
        </button>
      </div>
    </nav>
  );
}
