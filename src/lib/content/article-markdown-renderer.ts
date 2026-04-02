import GithubSlugger from "github-slugger";

export type ArticleTocItem = {
  id: string;
  level: number;
  text: string;
};

export function extractArticleToc(markdown: string): ArticleTocItem[] {
  const toc: ArticleTocItem[] = [];
  const slugger = new GithubSlugger();
  
  // Regex to match markdown headings (e.g., "## Heading 2"), ignoring code blocks
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    if (inCodeBlock) continue;
    
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let text = match[2].trim();
      
      // Strip markdown links/formatting from text for the TOC label if needed,
      // but keeping it simple usually works
      // Remove links: [text](url) -> text
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      // Remove bold/italic
      text = text.replace(/[*_]{1,2}(.*?)[*_]{1,2}/g, '$1');
      // Remove inline code
      text = text.replace(/`([^`]+)`/g, '$1');

      toc.push({
        id: slugger.slug(text),
        level,
        text,
      });
    }
  }

  return toc;
}

