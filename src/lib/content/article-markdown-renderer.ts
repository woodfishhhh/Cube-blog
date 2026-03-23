import MarkdownIt from "markdown-it";
import type { Options } from "markdown-it/lib/index.mjs";
import type Renderer from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";
import hljs from "highlight.js";

export type ArticleTocItem = {
  id: string;
  level: number;
  text: string;
};

let markdownRenderer: MarkdownIt | null = null;

export function renderArticleMarkdown(markdown: string) {
  if (!markdownRenderer) {
    markdownRenderer = createMarkdownRenderer();
  }

  return markdownRenderer.render(markdown.trim());
}

export function extractArticleToc(markdown: string): ArticleTocItem[] {
  if (!markdownRenderer) {
    markdownRenderer = createMarkdownRenderer();
  }

  const tokens = markdownRenderer.parse(markdown.trim(), {});
  const toc: ArticleTocItem[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type !== "heading_open") {
      continue;
    }

    const level = Number(token.tag.replace("h", ""));
    const inlineToken = tokens[index + 1];

    if (!inlineToken || inlineToken.type !== "inline" || level < 2 || level > 4) {
      continue;
    }

    toc.push({
      id: createHeadingId(inlineToken.content),
      level,
      text: inlineToken.content,
    });
  }

  return toc;
}

function createMarkdownRenderer() {
  const renderer: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: false,
  });

  renderer.set({
    ...renderer.options,
    highlight(code: string, language: string): string {
      return renderHighlightedCodeBlock(code, language, renderer.utils.escapeHtml);
    },
  });

  const defaultHeadingOpen =
    renderer.renderer.rules.heading_open ??
    ((tokens: Token[], index: number, options: Options, env: unknown, self: Renderer) =>
      self.renderToken(tokens, index, options));

  renderer.renderer.rules.heading_open = (
    tokens: Token[],
    index: number,
    options: Options,
    env: unknown,
    self: Renderer,
  ) => {
    const token = tokens[index];
    const inlineToken = tokens[index + 1];

    if (inlineToken?.type === "inline") {
      token.attrSet("id", createHeadingId(inlineToken.content));
    }

    return defaultHeadingOpen(tokens, index, options, env, self);
  };

  return renderer;
}

function renderHighlightedCodeBlock(
  code: string,
  language: string,
  escapeHtml: (value: string) => string,
) {
  const normalizedLanguage = language.trim().toLowerCase();
  const hasLanguage = normalizedLanguage.length > 0 && hljs.getLanguage(normalizedLanguage);
  const highlighted = hasLanguage
    ? hljs.highlight(code, { language: normalizedLanguage }).value
    : escapeHtml(code);
  const renderedLines = splitCodeLines(highlighted);
  const lineNumbers = renderedLines.map((_, index) => `<span class="line">${index + 1}</span><br>`).join("");
  const codeLines = renderedLines.map((line) => `<span class="line">${line}</span><br>`).join("");
  const languageClass = hasLanguage ? normalizedLanguage : "plain";
  const codeLanguageClass =
    normalizedLanguage === "js"
      ? "javascript"
      : normalizedLanguage === "ts"
        ? "typescript"
        : languageClass;

  return [
    `<figure class="highlight ${languageClass}">`,
    "<table><tr>",
    `<td class="gutter"><pre>${lineNumbers}</pre></td>`,
    `<td class="code"><pre>${codeLines}</pre></td>`,
    "</tr></table>",
    `<span class="article-code-language language-${codeLanguageClass}">${escapeHtml(languageClass)}</span>`,
    "</figure>",
  ].join("");
}

function splitCodeLines(highlighted: string) {
  const trimmed = highlighted.replace(/\n$/, "");
  const rawLines = trimmed.split("\n");

  return rawLines.length === 1 && rawLines[0] === ""
    ? ["&nbsp;"]
    : rawLines.map((line) => (line.length > 0 ? line : "&nbsp;"));
}

function createHeadingId(text: string) {
  return text
    .normalize("NFKC")
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-");
}
