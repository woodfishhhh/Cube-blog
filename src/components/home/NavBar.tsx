"use client";

import { useEffect, useState } from "react";

type NavBarProps = {
  activeMode?: "home-hero" | "home-blog" | "home-author";
  context?: "home" | "article";
  onSelectMode?: (mode: "home-blog" | "home-author") => void;
};

const navItems = [
  { href: "#selected-writing", label: "博客", mode: "home-blog" },
  { href: "#author-profile", label: "作者", mode: "home-author" },
] as const;

function hasStackedMobileHome() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.querySelector("[data-mobile-home-layout='stacked']") !== null;
}

export function NavBar({
  activeMode = "home-hero",
  context = "home",
  onSelectMode,
}: NavBarProps) {
  const [usesDirectLinks, setUsesDirectLinks] = useState(false);

  useEffect(() => {
    const updateDirectLinkMode = () => {
      setUsesDirectLinks(hasStackedMobileHome());
    };

    updateDirectLinkMode();

    const observer = new MutationObserver(updateDirectLinkMode);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile-home-layout"],
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className="shell-nav" data-shell-context={context}>
      <div className="shell-nav__brand" aria-label="WOODFISH brand">
        <span className="shell-nav__mark" aria-hidden="true" />
        <span className="shell-nav__wordmark">WOODFISH</span>
      </div>

      <nav className="shell-nav__links" aria-label="Primary">
        {navItems.map((item, index) => (
          <div className="shell-nav__item" key={item.mode}>
            {index > 0 ? (
              <span className="shell-nav__divider" aria-hidden="true">
                /
              </span>
            ) : null}
            {usesDirectLinks ? (
              <a
                aria-current={activeMode === item.mode ? "location" : undefined}
                className="shell-nav__link"
                data-active={activeMode === item.mode}
                data-scene-interaction-block="true"
                href={item.href}
                onClick={() => onSelectMode?.(item.mode)}
              >
                {item.label}
              </a>
            ) : (
              <button
                aria-pressed={activeMode === item.mode}
                type="button"
                className="shell-nav__link"
                data-active={activeMode === item.mode}
                onClick={() => onSelectMode?.(item.mode)}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
