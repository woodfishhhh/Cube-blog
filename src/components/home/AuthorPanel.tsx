import Image from "next/image";

import type { HomeAuthorData } from "@/lib/content/types";

type AuthorPanelProps = {
  author: HomeAuthorData;
};

export function AuthorPanel({ author }: AuthorPanelProps) {
  const studyLine = [author.university, author.major].filter(Boolean).join(" · ");
  const summaryLines = [author.introduction, author.slogan].filter(Boolean);
  const factRows: Array<{ label: string; value: string }> = [];
  const groups: Array<{ title: string; items: string[] }> = [];

  if (author.location) {
    factRows.push({ label: "Location", value: author.location });
  }

  if (author.occupation) {
    factRows.push({ label: "Occupation", value: author.occupation });
  }

  if (studyLine) {
    factRows.push({ label: "Study", value: studyLine });
  }

  if (author.focusAreas.length > 0) {
    groups.push({ title: "Focus Areas", items: author.focusAreas });
  }

  if (author.profileTags.length > 0) {
    groups.push({ title: "Signals", items: author.profileTags });
  }

  return (
    <section
      className="content-panel content-panel--author"
      aria-labelledby="home-author-panel-title"
      data-home-scroll-panel="true"
      id="author-profile"
    >
      <div className="content-panel__header">
        <p className="content-panel__eyebrow">Profile layer</p>
        <h2 className="content-panel__title" id="home-author-panel-title">
          Author Profile
        </h2>
        <p className="content-panel__lede">
          Selected fields from the internal author profile, normalized from the original about
          source and kept intentionally restrained.
        </p>
      </div>

      <div className="author-panel__body">
        <div className="author-panel__identity">
          {author.avatarUrl ? (
            <Image
              className="author-panel__portrait"
              src={author.avatarUrl}
              alt={`${author.displayName} portrait`}
              width={320}
              height={400}
              sizes="(max-width: 640px) 9rem, 8rem"
            />
          ) : null}

          <div className="author-panel__intro">
            <p className="author-panel__name">{author.displayName}</p>
            {author.headline ? <p className="author-panel__headline">{author.headline}</p> : null}

            <div className="author-panel__summaries">
              {summaryLines.map((line) => (
                <p className="author-panel__summary" key={line}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {factRows.length > 0 || groups.length > 0 ? (
          <div className="author-panel__details">
            {factRows.length > 0 ? (
              <dl className="author-panel__facts">
                {factRows.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {groups.length > 0 ? (
              <div className="author-panel__groups">
                {groups.map((group) => (
                  <section className="author-panel__group" key={group.title}>
                    <h3>{group.title}</h3>
                    <ul className="token-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
