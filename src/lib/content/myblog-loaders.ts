import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { formatPublishedDate } from "@/lib/content/date";

export const MY_BLOG_DIR = path.resolve(process.cwd(), "..", "MyBlog");
export const ABOUT_ME_PATH = path.resolve(process.cwd(), "..", "Blog", "source", "about", "index.md");

export async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  try {
    const list = await readdir(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        const subFiles = await getAllMarkdownFiles(filePath);
        results = results.concat(subFiles);
      } else if (fileStat.isFile() && filePath.endsWith(".md")) {
        results.push(filePath);
      }
    }
  } catch (e) {
    console.error("Error reading directory", dir, e);
  }
  return results;
}

export async function getMyBlogPosts() {
  const mdFiles = await getAllMarkdownFiles(MY_BLOG_DIR);
  const posts = [];

  for (const file of mdFiles) {
    const raw = await readFile(file, "utf8");
    const parsed = matter(raw);

    // Generate a simple slug from the filename without extension
    const slug = path.basename(file, ".md");

    const title = parsed.data.title || slug;
    const dateStr = parsed.data.date || "2026-01-01";

    // We get the first paragraph or generic excerpt
    let excerpt = "A deep dive into " + title + ".";
    const paragraphs = parsed.content.split("\n\n").filter(p => p.trim() && !p.startsWith("#") && !p.startsWith("---"));
    if (paragraphs.length > 0) {
      excerpt = paragraphs[0].substring(0, 150) + "...";
    }

    posts.push({
      slug,
      title,
      publishedAt: new Date(dateStr).toISOString(),
      publishedLabel: formatPublishedDate(new Date(dateStr).toISOString()),
      tags: parsed.data.tags || [],
      categories: parsed.data.categories || [],
      excerpt,
      content: parsed.content
    });
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return posts;
}

export async function getAuthorData() {
  try {
    let raw = "";
    try {
      raw = await readFile(ABOUT_ME_PATH, "utf8");
    } catch (e) {
      console.warn("About me markdown not found, using fallback config.");
    }

    // Attempt to read config if markdown is empty or sparse
    const configPath = path.resolve(process.cwd(), "..", "Blog", "_config.yml");
    let configData: any = {};
    try {
      const configRaw = await readFile(configPath, 'utf8');
      // Simple yaml parse for key fields to avoid dependency if possible, or just regex
      // We know structure: author: woodfish, subtitle: ...
      const authorMatch = configRaw.match(/author:\s*(.*)/);
      const subMatch = configRaw.match(/subtitle:\s*(.*)/);
      if (authorMatch) configData.author = authorMatch[1].trim();
      if (subMatch) configData.subtitle = subMatch[1].trim();
    } catch (e) {
      console.warn("Config not found", e);
    }

    const parsed = matter(raw || "");
    const content = parsed.content || configData.subtitle || "Exploring the digital frontier.";

    return {
      displayName: configData.author || "WOODFISH",
      role: "Creative Developer",
      bio: configData.subtitle || "HOLA, this is woodfish!",
      avatarUrl: "",
      content: content,
      contact: {
        github: "https://github.com/woodfish",
      }
    };
  } catch (e) {
    console.error("Failed to load author data:", e);
    return {
      displayName: "WOODFISH",
      role: "前端创意工程师",
      bio: "Welcome to my immersive space.",
      content: "This is a placeholder for author content.",
      contact: {}
    }
  }
}
