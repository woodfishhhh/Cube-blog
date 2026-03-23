import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

// Paths relative to 3Dblog root
const MY_BLOG_PATH = path.join(process.cwd(), '../MyBlog');
const BLOG_ABOUT_PATH = path.join(process.cwd(), '../Blog/source/_data/about.yml');
const BLOG_LINK_PATH = path.join(process.cwd(), '../Blog/source/_data/link.yml');

export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  content: string;
  filePath: string;
}

export interface AuthorInfo {
  name: string;
  title: string;
  slogan: string;
  intro: string;
  avatar: string;
  postsCount: number;
  tagsCount: number;
  categoriesCount: number;
  skills: { title: string; color: string; img: string }[];
  tags: string[];
}

export interface FriendLink {
  name: string;
  link: string;
  avatar?: string;
  descr?: string;
  className?: string;
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'assets' && file !== 'images' && !file.startsWith('.')) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

export async function getPosts(): Promise<Post[]> {
  const filePaths = getAllFiles(MY_BLOG_PATH);

  const posts = filePaths.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Only process files with valid frontmatter
    if (!data.title) return null;

    const id = path.basename(filePath, '.md');

    return {
      id,
      title: data.title,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: content.slice(0, 150).replace(/[#*`]/g, '') + '...',
      categories: data.categories || [],
      tags: data.tags || [],
      content,
      filePath
    };
  }).filter(Boolean) as Post[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAuthorInfo(): Promise<AuthorInfo> {
  const posts = await getPosts();
  const tagsSet = new Set<string>();
  const categoriesSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(t => tagsSet.add(t));
    post.categories.forEach(c => categoriesSet.add(c));
  });

  const baseInfo = {
    avatar: 'https://pic1.imgdb.cn/item/682f3d1658cb8da5c807b704.jpg',
    postsCount: posts.length,
    tagsCount: tagsSet.size,
    categoriesCount: categoriesSet.size,
  };

  try {
    if (!fs.existsSync(BLOG_ABOUT_PATH)) {
      return {
        name: 'Woodfish',
        title: 'Creative Developer',
        slogan: 'Coding the universe.',
        intro: 'Welcome to my 3D space.',
        skills: [],
        tags: [],
        ...baseInfo
      };
    }
    const fileContent = fs.readFileSync(BLOG_ABOUT_PATH, 'utf-8');
    const data = yaml.load(fileContent) as any;

    const tagsToRemove = [
      "数码科技爱好者",
      "🔍 分享与热心帮助",
      "🏠 我是鱼唇大学生",
      "🔨 前端开发正在学",
      "学习算法和音乐 🤝",
      "脚踏实地行动派 🏃",
      "团队小组发动机 🧱",
      "电子音乐制作人 🎧"
    ];

    let rawTags = [...(data.authorinfo?.leftTags || []), ...(data.authorinfo?.rightTags || [])];
    const filteredTags = rawTags.filter((tag: any) => {
      const title = typeof tag === 'string' ? tag : (tag.title || tag);
      return !tagsToRemove.some(t => title.includes(t));
    });

    return {
      name: data.contentinfo?.name || 'Woodfish',
      title: data.contentinfo?.title || 'Developer',
      slogan: data.contentinfo?.slogan || '',
      intro: data.contentinfo?.sup || '',
      skills: data.skills?.tags || [],
      tags: filteredTags,
      ...baseInfo
    };
  } catch (error) {
    console.error('Error reading author info:', error);
    return {
      name: 'Woodfish',
      title: 'Developer',
      slogan: '',
      intro: '',
      skills: [],
      tags: [],
      ...baseInfo
    };
  }
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function getFriendLinks(): Promise<FriendLink[]> {
  try {
    if (!fs.existsSync(BLOG_LINK_PATH)) return [];

    const fileContent = fs.readFileSync(BLOG_LINK_PATH, 'utf-8');
    const data = yaml.load(fileContent) as { links?: unknown };
    const groups = Array.isArray(data?.links) ? data.links : [];

    const result: FriendLink[] = [];

    for (const group of groups) {
      if (typeof group !== 'object' || group === null) continue;

      const typedGroup = group as {
        class_name?: unknown;
        link_list?: unknown;
      };
      const className = toText(typedGroup.class_name);
      const linkList = Array.isArray(typedGroup.link_list) ? typedGroup.link_list : [];

      for (const item of linkList) {
        if (typeof item !== 'object' || item === null) continue;

        const typedItem = item as {
          name?: unknown;
          link?: unknown;
          avatar?: unknown;
          descr?: unknown;
        };

        const name = toText(typedItem.name);
        const link = toText(typedItem.link);
        if (!name || !link) continue;

        result.push({
          name,
          link,
          avatar: toText(typedItem.avatar) || undefined,
          descr: toText(typedItem.descr) || undefined,
          className: className || undefined,
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error reading friend links:', error);
    return [];
  }
}
