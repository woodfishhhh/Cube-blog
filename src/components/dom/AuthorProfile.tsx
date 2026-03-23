"use client";

import { AuthorInfo } from "@/lib/data";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AuthorProfile({ info }: { info: AuthorInfo }) {
  return (
    <div
      id="author-scroll-container"
      className="w-full h-full text-white overflow-y-auto modern-scrollbar relative font-sans scroll-smooth px-6 md:px-10 py-16">
      {/* Dynamic Wave Lines Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-screen">
        <svg
          className="w-full h-[200%] absolute top-[-50%] left-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          <motion.path
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.2"
            animate={{
              d: [
                "M0,30 Q25,10 50,30 T100,30 L100,100 L0,100 Z",
                "M0,30 Q25,50 50,30 T100,30 L100,100 L0,100 Z",
                "M0,30 Q25,10 50,30 T100,30 L100,100 L0,100 Z",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.2"
            initial={{ y: 10 }}
            animate={{
              d: [
                "M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z",
                "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
                "M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z",
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-[400px] mx-auto relative z-10 flex flex-col gap-12 pb-32">
        {/* Header Section (Avatar, Name, Stats, Socials) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mt-12">
          <div className="w-24 h-24 md:w-32 md:h-32 mb-6 relative group border border-white/10 rounded-full">
            <div className="absolute inset-0 bg-transparent group-hover:bg-transparent transition-colors duration-700 z-10 rounded-full" />
            <img
              src={
                info.avatar ||
                "https://pic1.imgdb.cn/item/682f3d1658cb8da5c807b704.jpg"
              }
              alt={info.name}
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700 ease-out rounded-full"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tighter uppercase text-white/90">
            {info.name}
          </h2>
          <p className="text-white/40 tracking-[0.3em] text-[10px] uppercase mb-8 font-light">
            {info.title}
          </p>

          {/* Stats */}
          <div className="w-full flex justify-center gap-8 md:gap-12 mb-8 py-6 border-y border-white/5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-light text-white/80">
                {info.postsCount || 0}
              </span>
              <span className="text-[9px] text-white/30 tracking-widest uppercase">
                Articles
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-light text-white/80">
                {info.categoriesCount || 0}
              </span>
              <span className="text-[9px] text-white/30 tracking-widest uppercase">
                Categories
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-light text-white/80">
                {info.tagsCount || 0}
              </span>
              <span className="text-[9px] text-white/30 tracking-widest uppercase">
                Tags
              </span>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-4 flex-wrap justify-center">
            <a
              href="https://github.com/woodfishhhh"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-500 text-white/50 group">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white/50 group-hover:text-black transition-colors">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a
              href="https://space.bilibili.com/359728114"
              target="_blank"
              rel="noopener noreferrer"
              title="Bilibili"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#FB7299] hover:border-[#FB7299] transition-all duration-500 text-white/50 group">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white/50 group-hover:text-white transition-colors">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </a>
            <a
              href="https://www.woodfishhhh.xyz/images/af1a055d14e4f7f6eae2886f2865d13.jpg.jpeg?_t=1750312382930"
              target="_blank"
              rel="noopener noreferrer"
              title="QQ"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#12B7F5] hover:border-[#12B7F5] transition-all duration-500 text-white/50 group">
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                className="w-4 h-4 text-white/50 group-hover:text-white transition-colors">
                <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"></path>
              </svg>
            </a>
            <a
              href="https://www.woodfishhhh.xyz/images/f59723db9159310b6056abe8341f5d7.jpg.jpeg?_t=1750312263368"
              target="_blank"
              rel="noopener noreferrer"
              title="WeChat"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#07C160] hover:border-[#07C160] transition-all duration-500 text-white/50 group">
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                className="w-4 h-4 text-white/50 group-hover:text-white transition-colors">
                <path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"></path>
              </svg>
            </a>
            <a
              href="https://www.woodfishhhh.xyz/images/d8d58d2f2c7ac5790fd37f388da41db4.png?_t=1759286665402"
              target="_blank"
              rel="noopener noreferrer"
              title="Email"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-black transition-colors duration-500 text-white/50 group">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white/50 group-hover:text-black transition-colors">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
            <a
              href="https://www.douyin.com/user/MS4wLjABAAAAgbOrIhdi7Rl5RfaQ3fE3i7c2WnyR3zEOyLiK2Cjtcqk?from_tab_name=main"
              target="_blank"
              rel="noopener noreferrer"
              title="Douyin"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-black hover:border-white transition-all duration-500 text-white/50 group relative">
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                className="w-4 h-4 text-white/50 group-hover:text-white transition-colors relative z-10">
                <path d="M937.4 423.9c-84 0-165.7-27.3-232.9-77.8v352.3c0 179.9-138.6 325.6-309.6 325.6S85.3 878.3 85.3 698.4c0-179.9 138.6-325.6 309.6-325.6 17.1 0 33.7 1.5 49.9 4.3v186.6c-15.5-6.1-32-9.2-48.6-9.2-76.3 0-138.2 65-138.2 145.3 0 80.2 61.9 145.3 138.2 145.3 76.2 0 138.1-65.1 138.1-145.3V0H707c0 134.5 103.7 243.5 231.6 243.5v180.3l-1.2 0.1"></path>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Section: Philosophy */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          className="relative group">
          <div className="absolute -left-2 -top-6 text-white/[0.02] text-7xl font-black italic select-none -z-10 group-hover:text-white/[0.05] transition-colors duration-1000">
            01
          </div>
          <h3 className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4 ml-1">
            Philosophy
          </h3>
          <p className="text-xl md:text-2xl font-extralight leading-[1.4] text-white/90">
            {info.slogan || "Simplicity is the ultimate sophistication."}
          </p>
        </motion.section>

        {/* Section: Biography */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          className="relative group">
          <div className="absolute -left-2 -top-6 text-white/[0.02] text-7xl font-black italic select-none -z-10 group-hover:text-white/[0.05] transition-colors duration-1000">
            02
          </div>
          <h3 className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-4 ml-1">
            Biography
          </h3>
          <div className="text-sm md:text-base text-white/60 font-light leading-relaxed border-l border-white/10 pl-6 py-1">
            <p>
              {info.intro ||
                "Passionate about crafting digital experiences that harmonize clean aesthetics with functional architectures. Driven by the infinite possibilities of web technologies and minimalist design."}
            </p>
          </div>
        </motion.section>

        {/* Section: Capabilities */}
        <section className="relative group">
          <div className="absolute -left-2 -top-6 text-white/[0.02] text-7xl font-black italic select-none -z-10 group-hover:text-white/[0.05] transition-colors duration-1000">
            03
          </div>
          <h3 className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6 ml-1">
            Capabilities
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-6">
            {info.skills?.length > 0
              ? info.skills.map((skill: any, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col group/skill cursor-pointer"
                    whileHover={{ y: -4 }}>
                    <div className="h-[1px] w-6 bg-white/20 mb-3 group-hover/skill:w-full group-hover/skill:bg-white transition-all duration-700 ease-out" />
                    <div className="flex items-center gap-2">
                      {skill.img && (
                        <img
                          src={skill.img}
                          alt={skill.title}
                          className="w-4 h-4 object-contain transition-transform duration-500 group-hover/skill:scale-110"
                        />
                      )}
                      <span className="text-sm md:text-base font-light tracking-wide text-white/70 group-hover/skill:text-white/100 transition-colors">
                        {skill.title}
                      </span>
                    </div>
                  </motion.div>
                ))
              : [
                  "React",
                  "Three.js",
                  "Next.js",
                  "TailwindCSS",
                  "WebGL",
                  "UI/UX",
                  "Framer Motion",
                  "TypeScript",
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col group/skill cursor-pointer"
                    whileHover={{ y: -4 }}>
                    <div className="h-[1px] w-6 bg-white/20 mb-3 group-hover/skill:w-full group-hover/skill:bg-white transition-all duration-700 ease-out" />
                    <span className="text-sm md:text-base font-light tracking-wider text-white/50 group-hover/skill:text-white transition-colors">
                      {s}
                    </span>
                  </motion.div>
                ))}
          </div>
        </section>

        {/* Section: Footprints */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          className="relative group">
          <div className="absolute -left-2 -top-6 text-white/[0.02] text-7xl font-black italic select-none -z-10 group-hover:text-white/[0.05] transition-colors duration-1000">
            04
          </div>
          <h3 className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6 ml-1">
            Footprints
          </h3>
          <div className="flex flex-wrap gap-2">
            {info.tags?.map((tag: any, i: number) => {
              const tagTitle = typeof tag === "string" ? tag : tag.title || tag;
              return (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 border border-white/10 rounded-full text-[10px] md:text-xs font-light text-white/40 hover:bg-white hover:text-black transition-colors duration-500 cursor-default uppercase tracking-widest bg-white/[0.02] hover:bg-white">
                  {tagTitle}
                </motion.span>
              );
            })}
          </div>
        </motion.section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .modern-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `,
        }}
      />
    </div>
  );
}
