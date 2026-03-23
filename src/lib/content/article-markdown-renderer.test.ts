import { describe, expect, it } from "vitest";

import { renderArticleMarkdown } from "@/lib/content/article-markdown-renderer";

describe("renderArticleMarkdown", () => {
  it("renders headings, blockquotes, and Blog-like highlighted code blocks", () => {
    const html = renderArticleMarkdown(`
## 介绍

> 掌握 JavaScript 的引入方式。

\`\`\`js
const answer = 42;
console.log(answer);
\`\`\`
`);

    expect(html).toContain('<h2 id="介绍">介绍</h2>');
    expect(html).toContain("<blockquote>");
    expect(html).toContain('<figure class="highlight js">');
    expect(html).toContain('<td class="gutter">');
    expect(html).toContain('<td class="code">');
    expect(html).toContain("language-javascript");
  });
});
