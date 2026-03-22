"use client";

import { AuthorPanel } from "@/components/home/AuthorPanel";
import { BlogPanel } from "@/components/home/BlogPanel";
import { HeroIntro } from "@/components/home/HeroIntro";
import { dispatchHomeSceneIntent } from "@/components/home/use-home-scene-controller";
import type { HomePageData } from "@/lib/content/types";

type MobileHomeProps = {
  data: HomePageData;
};

const mobileSectionLinks = [
  { href: "#selected-writing", label: "博客", mode: "home-blog" },
  { href: "#author-profile", label: "作者", mode: "home-author" },
] as const;

export function MobileHome({ data }: MobileHomeProps) {
  return (
    <main
      className="article-page"
      aria-label="Mobile homepage editorial shell"
      data-home-interaction-mode="touch-static"
      data-mobile-home-layout="stacked"
    >
      <div className="home-panel-rail__stack">
        <HeroIntro hero={data.hero} />

        <section className="shell-panel shell-panel--mobile-entry" aria-labelledby="mobile-home-access-title">
          <div className="shell-panel__header">
            <p className="shell-panel__label">Direct access</p>
            <p className="shell-panel__value" id="mobile-home-access-title">
              Read first, move later.
            </p>
          </div>

          <p className="shell-panel__body">
            Tap directly into writing or author context. The scene can stay atmospheric while
            the content remains immediate.
          </p>

          <nav className="shell-nav__links" aria-label="Mobile homepage sections">
            {mobileSectionLinks.map((link) => (
              <a
                key={link.href}
                className="shell-nav__link"
                href={link.href}
                data-scene-interaction-block="true"
                onClick={() => {
                  dispatchHomeSceneIntent({
                    type: "home-nav-click",
                    origin: "ui",
                    target: link.mode,
                  });
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        <BlogPanel posts={data.posts} />
        <AuthorPanel author={data.author} />
      </div>
    </main>
  );
}
