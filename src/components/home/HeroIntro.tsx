import type { HomeHeroData } from "@/lib/content/types";

type HeroIntroProps = {
  hero: HomeHeroData;
};

export function HeroIntro({ hero }: HeroIntroProps) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__frame">
        <div className="home-hero__masthead">
          <p className="home-hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="home-hero__title" id="home-hero-title">
            {hero.title}
          </h1>
        </div>

        <div className="home-hero__body">
          <p className="home-hero__summary">{hero.summary}</p>
        </div>
      </div>
    </section>
  );
}
