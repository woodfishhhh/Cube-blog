export default function PostNotFoundPage() {
  return (
    <main className="article-page">
      <section aria-labelledby="article-not-found-title" className="article-view">
        <header className="article-view__header">
          <p className="article-view__eyebrow">Route fallback</p>
          <h1 className="article-view__title" id="article-not-found-title">
            Article not found
          </h1>
          <p className="article-view__excerpt">
            The requested article slug does not map to the current launch manifest, so this route
            resolves through the safe Next 404 boundary instead of crashing the app shell.
          </p>
          <div aria-label="Article metadata" className="article-view__meta">
            <span className="article-view__meta-item">
              <span>Status</span>
              <span>404</span>
            </span>
            <span className="article-view__meta-item">
              <span>Route</span>
              <span>/posts/[slug]</span>
            </span>
            <span className="article-view__meta-item">
              <span>Scroll</span>
              <span>Document</span>
            </span>
          </div>
        </header>

        <div className="article-markdown">
          <p>Return to a known article route from the homepage list to continue reading.</p>
        </div>
      </section>
    </main>
  );
}
