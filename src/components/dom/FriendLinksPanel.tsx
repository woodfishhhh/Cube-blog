"use client";

import { FriendLink } from "@/lib/data";
import { motion } from "framer-motion";

export function FriendLinksPanel({ links }: { links: FriendLink[] }) {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-light text-white mb-6 border-b border-white/20 pb-2 shrink-0">
        Friend Links
      </h2>
      <div
        id="friend-links-container"
        className="flex-1 min-h-0 overflow-y-auto pr-2 pb-10 scrollbar-thin">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((item, index) => (
            <motion.a
              key={`${item.name}-${item.link}`}
              href={item.link}
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="group rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors p-4 flex items-start gap-3">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-white font-semibold truncate group-hover:text-blue-300 transition-colors">
                  {item.name}
                </div>
                <div className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {item.descr || "友情链接"}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
