export const CONTENT_SOURCE_ROOTS = ["blog", "myblog"] as const;

export type ContentSourceRoot = (typeof CONTENT_SOURCE_ROOTS)[number];

export type ContentLookupFailureReason =
  | "not-found"
  | "missing-source"
  | "invalid-frontmatter"
  | "invalid-author-profile";

export type ContentSourceDescriptor = {
  sourceRoot: ContentSourceRoot;
  sourcePath: string;
};

export type LaunchManifestEntry = ContentSourceDescriptor & {
  slug: string;
};

export type RawPostFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
};

export type NormalizedLaunchPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  categories: string[];
  body: string;
  summary?: string;
  source: ContentSourceDescriptor;
};

export type RawAuthorInfoSection = {
  leftTags?: string[];
  rightTags?: string[];
  image?: string;
};

export type RawAuthorContentInfoSection = {
  sup?: string;
  name?: string;
  title?: string;
  tip?: string;
  slogan?: string;
  mask?: string[];
};

export type RawAuthorOneselfSection = {
  map?: {
    light?: string;
    dark?: string;
  };
  location?: string;
  birthYear?: number;
  university?: string;
  major?: string;
  occupation?: string;
};

export type RawAuthorProfileSource = {
  title?: string;
  contentinfo?: RawAuthorContentInfoSection;
  authorinfo?: RawAuthorInfoSection;
  oneself?: RawAuthorOneselfSection;
};

export type NormalizedAuthorProfile = {
  displayName: string;
  siteTitle?: string;
  introduction?: string;
  headline?: string;
  slogan?: string;
  avatarUrl?: string;
  location?: string;
  birthYear?: number;
  university?: string;
  major?: string;
  occupation?: string;
  profileTags: string[];
  focusAreas: string[];
  source: ContentSourceDescriptor;
};

export type HomePostCardData = {
  slug: string;
  title: string;
  publishedAt: string;
  publishedLabel: string;
  tags: string[];
  categories: string[];
  excerpt: string;
};

export type HomeAuthorData = {
  displayName: string;
  introduction?: string;
  headline?: string;
  slogan?: string;
  location?: string;
  occupation?: string;
  university?: string;
  major?: string;
  profileTags: string[];
  focusAreas: string[];
  avatarUrl?: string;
};

export type HomeHeroData = {
  eyebrow: string;
  title: string;
  summary: string;
};

export type HomePageData = {
  hero: HomeHeroData;
  posts: HomePostCardData[];
  author: HomeAuthorData;
};

export type ArticleData = HomePostCardData & {
  body: string;
};

export type ParsedMarkdownDocument = {
  body: string;
  excerpt: string;
  frontmatter: RawPostFrontmatter;
};

export type ContentLookupResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: ContentLookupFailureReason;
      source?: ContentSourceDescriptor;
      slug?: string;
    };
