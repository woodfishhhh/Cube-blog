"use client";

import { useStore } from "@/store/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);
  const exitFocus = useStore((state) => state.exitFocus);
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (targetMode: "home" | "blog" | "author" | "friend") => {
    setMode(targetMode);
    exitFocus();
    setIsOpen(false);
  };

  const navItems = [
    { id: "home" as const, label: "Home" },
    { id: "blog" as const, label: "Blog" },
    { id: "author" as const, label: "Author" },
    { id: "friend" as const, label: "Friend" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
      <div
        className="text-xl font-bold tracking-widest text-white pointer-events-auto cursor-pointer mix-blend-difference"
        onClick={() => handleNav("home")}>
        WOODFISH
      </div>

      <div className="hidden md:flex gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`text-sm tracking-widest uppercase transition-colors hover:text-blue-400 ${mode === item.id ? "text-blue-400" : "text-gray-400"}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="md:hidden pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-blue-400 transition-colors p-2"
          aria-label="Toggle Menu">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 right-6 bg-black/80 backdrop-blur-md border border-gray-800 rounded-lg p-4 flex flex-col gap-4 pointer-events-auto md:hidden min-w-[150px] shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm tracking-widest uppercase text-left transition-colors hover:text-blue-400 ${mode === item.id ? "text-blue-400 w-full" : "text-gray-400 w-full"}`}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

