const reservedNavItems = ["博客", "作者"] as const;

export function SiteNav() {
  return (
    <header className="shell-nav">
      <div className="shell-nav__brand" aria-label="WOODFISH brand">
        <span className="shell-nav__mark" aria-hidden="true" />
        <span className="shell-nav__wordmark">WOODFISH</span>
      </div>

      <nav className="shell-nav__links" aria-label="Primary">
        {reservedNavItems.map((item, index) => (
          <div className="shell-nav__item" key={item}>
            {index > 0 ? (
              <span className="shell-nav__divider" aria-hidden="true">
                /
              </span>
            ) : null}
            <button
              type="button"
              className="shell-nav__link"
              aria-disabled="true"
            >
              {item}
            </button>
          </div>
        ))}
      </nav>
    </header>
  );
}
