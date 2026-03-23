"use client";

import { useStore } from "@/store/store";
import { motion } from "framer-motion";

export function NavigationNew() {
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);
  const exitFocus = useStore((state) => state.exitFocus);

  const handleNav = (targetMode: "home" | "blog" | "author" | "friend") => {
    setMode(targetMode);
    exitFocus();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
      <div
        className="text-xl font-bold tracking-widest text-white pointer-events-auto cursor-pointer mix-blend-difference"
        onClick={() => handleNav("home")}>
        WOODFISH
      </div>

      <div className="flex gap-8 pointer-events-auto">
        <button
          onClick={() => handleNav("home")}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "home" ? "text-blue-400" : "text-gray-400"}`}>
          Home
        </button>
        <button
          onClick={() => handleNav("blog")}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "blog" ? "text-blue-400" : "text-gray-400"}`}>
          Blog
        </button>
        <button
          onClick={() => handleNav("author")}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "author" ? "text-blue-400" : "text-gray-400"}`}>
          Author
        </button>
        <button
          onClick={() => handleNav("friend")}
          className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === "friend" ? "text-blue-400" : "text-gray-400"}`}>
          Frient
        </button>
      </div>
    </nav>
  );
}
