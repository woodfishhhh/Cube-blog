import path from "node:path";

export function getContentSourceRoot(cwd = process.cwd()) {
  return path.resolve(cwd, "content", "source");
}

export function getMyBlogSourceRoot(cwd = process.cwd()) {
  return path.resolve(getContentSourceRoot(cwd), "myblog");
}

export function getBlogSourceRoot(cwd = process.cwd()) {
  return path.resolve(getContentSourceRoot(cwd), "blog");
}

export function getBlogAboutYamlPath(cwd = process.cwd()) {
  return path.resolve(getBlogSourceRoot(cwd), "source", "_data", "about.yml");
}

export function getBlogLinkYamlPath(cwd = process.cwd()) {
  return path.resolve(getBlogSourceRoot(cwd), "source", "_data", "link.yml");
}

export function getBlogAboutMarkdownPath(cwd = process.cwd()) {
  return path.resolve(getBlogSourceRoot(cwd), "source", "about", "index.md");
}

export function getBlogConfigPath(cwd = process.cwd()) {
  return path.resolve(getBlogSourceRoot(cwd), "_config.yml");
}
