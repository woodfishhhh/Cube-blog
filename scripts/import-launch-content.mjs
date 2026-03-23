import { access, copyFile, mkdir, opendir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MARKDOWN_IMAGE_REFERENCE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)|<img([^>]*?)src=(['"])(.*?)\4([^>]*)>/g;
const REMOTE_REFERENCE_PATTERN = /^(?:[a-z]+:)?\/\//i;
const DATA_REFERENCE_PATTERN = /^data:/i;
const WINDOWS_ABSOLUTE_PATH_PATTERN = /^[a-zA-Z]:[\\/]/;

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_WORKSPACE_ROOT = path.resolve(SCRIPT_ROOT, "..");

/**
 * @typedef {{ sourceRoot: "blog" | "myblog", sourcePath: string }} ContentSourceDescriptor
 * @typedef {ContentSourceDescriptor & { slug: string }} LaunchManifestEntry
 * @typedef {{
 *   workspaceRoot?: string,
 *   launchPostManifest?: LaunchManifestEntry[],
 *   authorProfileSource?: ContentSourceDescriptor,
 *   sourceRoots?: Record<"blog" | "myblog", string>,
 *   assetSearchRoots?: string[],
 * }} LaunchImportOptions
 */

/**
 * @param {string} moduleSource
 */
export function parseLaunchManifestModule(moduleSource) {
  const authorMatch = moduleSource.match(
    /export const launchAuthorProfileSource = \{\s*sourceRoot: "([^"]+)",\s*sourcePath: "([^"]+)",\s*\}/s,
  );

  if (!authorMatch) {
    throw new Error("Unable to parse launchAuthorProfileSource from content/launch-manifest.ts");
  }

  const launchPostManifest = [...moduleSource.matchAll(/\{\s*slug: "([^"]+)",\s*sourceRoot: "([^"]+)",\s*sourcePath: "([^"]+)",\s*\}/gs)].map(
    (match) => ({
      slug: match[1],
      sourceRoot: match[2],
      sourcePath: match[3],
    }),
  );

  if (launchPostManifest.length === 0) {
    throw new Error("Unable to parse launchPostManifest entries from content/launch-manifest.ts");
  }

  return {
    authorProfileSource: {
      sourceRoot: authorMatch[1],
      sourcePath: authorMatch[2],
    },
    launchPostManifest,
  };
}

export async function loadDefaultLaunchImportOptions(workspaceRoot = DEFAULT_WORKSPACE_ROOT) {
  const manifestModulePath = path.resolve(workspaceRoot, "content", "launch-manifest.ts");
  const manifestSource = await readFile(manifestModulePath, "utf8");
  const parsedManifest = parseLaunchManifestModule(manifestSource);

  return {
    workspaceRoot,
    launchPostManifest: parsedManifest.launchPostManifest,
    authorProfileSource: parsedManifest.authorProfileSource,
    sourceRoots: {
      blog: path.resolve(workspaceRoot, "content", "source", "blog"),
      myblog: path.resolve(workspaceRoot, "content", "source", "myblog"),
    },
    assetSearchRoots: [
      path.resolve(workspaceRoot, "content", "source"),
    ],
  };
}

/**
 * @param {LaunchImportOptions} inputOptions
 */
export async function importLaunchContent(inputOptions = {}) {
  const options = await normalizeImportOptions(inputOptions);
  const plannedDestinations = new Map();
  const importedSlugs = [];

  for (const entry of options.launchPostManifest) {
    const sourceMarkdownPath = resolveSourceMarkdownPath(entry, options.sourceRoots);
    await assertPathExists(
      sourceMarkdownPath,
      `Missing source markdown for slug "${entry.slug}": ${entry.sourcePath}`,
    );

    const rawMarkdown = await readFile(sourceMarkdownPath, "utf8");
    const rewrittenPost = await rewriteMarkdownAssetReferences({
      assetSearchRoots: options.assetSearchRoots,
      entry,
      markdown: rawMarkdown,
      sourceMarkdownPath,
      sourceRootPath: options.sourceRoots[entry.sourceRoot],
      workspaceRoot: options.workspaceRoot,
    });

    const contentDestinationPath = resolveImportedPostDestinationPath(options.workspaceRoot, entry.slug);

    registerPlannedDestination(
      plannedDestinations,
      contentDestinationPath,
      `markdown:${entry.slug}`,
      path.relative(options.workspaceRoot, contentDestinationPath),
    );
    await writeTextFileIfUnchangedOrMissing(contentDestinationPath, rewrittenPost.markdown, options.workspaceRoot);

    for (const asset of rewrittenPost.assets) {
      const publicDestinationPath = path.resolve(options.workspaceRoot, "public", asset.destinationPath);

      registerPlannedDestination(
        plannedDestinations,
        publicDestinationPath,
        asset.sourcePath,
        asset.destinationPath,
      );
      await copyFileIfUnchangedOrMissing(asset.sourcePath, publicDestinationPath, options.workspaceRoot);
    }

    importedSlugs.push(entry.slug);
  }

  const authorSourcePath = resolveSourceMarkdownPath(options.authorProfileSource, options.sourceRoots);
  await assertPathExists(
    authorSourcePath,
    `Missing author profile source: ${options.authorProfileSource.sourcePath}`,
  );
  const normalizedAuthorProfile = normalizeAuthorProfile(
    parseAuthorProfileYaml(await readFile(authorSourcePath, "utf8")),
    options.authorProfileSource,
  );
  const authorDestinationPath = path.resolve(options.workspaceRoot, "content", "author", "profile.json");

  registerPlannedDestination(
    plannedDestinations,
    authorDestinationPath,
    `author:${options.authorProfileSource.sourcePath}`,
    path.relative(options.workspaceRoot, authorDestinationPath),
  );
  await writeTextFileIfUnchangedOrMissing(
    authorDestinationPath,
    `${JSON.stringify(normalizedAuthorProfile, null, 2)}\n`,
    options.workspaceRoot,
  );

  return {
    authorProfilePath: path.relative(options.workspaceRoot, authorDestinationPath).replaceAll("\\", "/"),
    importedSlugs: [...importedSlugs].sort(),
  };
}

function resolveImportedPostDestinationPath(workspaceRoot, slug) {
  return path.resolve(workspaceRoot, "content", "posts", slug, "index.md");
}

async function normalizeImportOptions(inputOptions) {
  const hasExplicitOptions =
    inputOptions.launchPostManifest && inputOptions.authorProfileSource && inputOptions.sourceRoots;

  const defaultOptions = hasExplicitOptions
    ? {
        workspaceRoot: inputOptions.workspaceRoot ?? DEFAULT_WORKSPACE_ROOT,
        launchPostManifest: inputOptions.launchPostManifest,
        authorProfileSource: inputOptions.authorProfileSource,
        sourceRoots: inputOptions.sourceRoots,
        assetSearchRoots: inputOptions.assetSearchRoots ?? [],
      }
    : await loadDefaultLaunchImportOptions(inputOptions.workspaceRoot ?? DEFAULT_WORKSPACE_ROOT);

  return {
    workspaceRoot: inputOptions.workspaceRoot ?? defaultOptions.workspaceRoot,
    launchPostManifest: inputOptions.launchPostManifest ?? defaultOptions.launchPostManifest,
    authorProfileSource: inputOptions.authorProfileSource ?? defaultOptions.authorProfileSource,
    sourceRoots: inputOptions.sourceRoots ?? defaultOptions.sourceRoots,
    assetSearchRoots: inputOptions.assetSearchRoots ?? defaultOptions.assetSearchRoots,
  };
}

function resolveSourceMarkdownPath(source, sourceRoots) {
  const sourceRootPath = sourceRoots[source.sourceRoot];

  if (!sourceRootPath) {
    throw new Error(`Unsupported source root: ${source.sourceRoot}`);
  }

  const candidatePath = path.resolve(sourceRootPath, source.sourcePath);
  assertPathWithinRoot(sourceRootPath, candidatePath, `source path for ${source.sourceRoot}:${source.sourcePath}`);
  return candidatePath;
}

async function rewriteMarkdownAssetReferences({
  assetSearchRoots,
  entry,
  markdown,
  sourceMarkdownPath,
  sourceRootPath,
  workspaceRoot,
}) {
  /** @type {Map<string, { sourcePath: string, destinationPath: string }>} */
  const assets = new Map();

  const rewrittenMarkdown = await replaceAsync(markdown, MARKDOWN_IMAGE_REFERENCE_PATTERN, async (...args) => {
    const match = args[0];
    const markdownAlt = args[1];
    const markdownReference = args[2];
    const htmlBefore = args[3] ?? "";
    const htmlQuote = args[4];
    const htmlReference = args[5];
    const htmlAfter = args[6] ?? "";

    const originalReference = markdownReference ?? htmlReference;

    if (!originalReference) {
      return match;
    }

    const rewrittenReference = await resolveAndRewriteAssetReference({
      assetSearchRoots,
      assets,
      entry,
      originalReference,
      sourceMarkdownPath,
      sourceRootPath,
      workspaceRoot,
    });

    if (rewrittenReference === originalReference) {
      return match;
    }

    if (markdownReference) {
      return `![${markdownAlt}](${rewrittenReference})`;
    }

    return `<img${htmlBefore}src=${htmlQuote}${rewrittenReference}${htmlQuote}${htmlAfter}>`;
  });

  return {
    assets: [...assets.values()],
    markdown: rewrittenMarkdown,
  };
}

async function resolveAndRewriteAssetReference({
  assetSearchRoots,
  assets,
  entry,
  originalReference,
  sourceMarkdownPath,
  sourceRootPath,
  workspaceRoot,
}) {
  const { pathPart, suffix } = splitReferenceSuffix(originalReference.trim());

  if (!pathPart || REMOTE_REFERENCE_PATTERN.test(pathPart) || DATA_REFERENCE_PATTERN.test(pathPart)) {
    return originalReference;
  }

  const resolvedSourceAssetPath = await resolveAssetPath({
    assetSearchRoots,
    entry,
    originalReference: pathPart,
    sourceMarkdownPath,
    sourceRootPath,
    workspaceRoot,
  });
  const destinationPath = buildPublicAssetDestinationPath(entry.slug, pathPart, resolvedSourceAssetPath);

  assets.set(destinationPath, {
    destinationPath,
    sourcePath: resolvedSourceAssetPath,
  });

  return `/${destinationPath.replaceAll("\\", "/")}${suffix}`;
}

async function resolveAssetPath({ assetSearchRoots, entry, originalReference, sourceMarkdownPath, sourceRootPath, workspaceRoot }) {
  if (WINDOWS_ABSOLUTE_PATH_PATTERN.test(originalReference) || path.isAbsolute(originalReference)) {
    const absoluteCandidate = path.resolve(originalReference);
    await assertPathExists(
      absoluteCandidate,
      `Missing referenced asset for slug "${entry.slug}": ${originalReference}`,
    );
    return absoluteCandidate;
  }

  const normalizedReference = originalReference.replaceAll("\\", "/");
  const markdownDirectory = path.dirname(sourceMarkdownPath);
  const directCandidate = path.resolve(markdownDirectory, normalizedReference);
  assertPathWithinRoot(
    sourceRootPath,
    directCandidate,
    `asset reference for slug "${entry.slug}": ${originalReference}`,
  );

  if (await pathExists(directCandidate)) {
    return directCandidate;
  }

  const sourceRootCandidate = path.resolve(sourceRootPath, normalizedReference);
  if (pathWithinRoot(sourceRootPath, sourceRootCandidate) && (await pathExists(sourceRootCandidate))) {
    return sourceRootCandidate;
  }

  const conventionCandidates = [
    path.resolve(sourceRootPath, "images", path.basename(normalizedReference)),
    path.resolve(sourceRootPath, "assets", path.basename(normalizedReference)),
    path.resolve(
      markdownDirectory,
      `${path.basename(sourceMarkdownPath, path.extname(sourceMarkdownPath))}.assets`,
      path.basename(normalizedReference),
    ),
  ];

  for (const candidate of conventionCandidates) {
    if (pathWithinRoot(sourceRootPath, candidate) && (await pathExists(candidate))) {
      return candidate;
    }
  }

  const fallbackMatches = await findFallbackAssetMatches(normalizedReference, assetSearchRoots, workspaceRoot);

  if (fallbackMatches.length === 1) {
    return fallbackMatches[0];
  }

  if (fallbackMatches.length > 1) {
    throw new Error(
      `Asset reference for slug "${entry.slug}" matched multiple fallback files: ${originalReference} -> ${fallbackMatches.join(", ")}`,
    );
  }

  throw new Error(`Missing referenced asset for slug "${entry.slug}": ${originalReference}`);
}

async function findFallbackAssetMatches(referencePath, assetSearchRoots, workspaceRoot) {
  const normalizedSuffix = referencePath.replaceAll("\\", "/").toLowerCase();
  const fileName = path.basename(referencePath).toLowerCase();
  const matches = [];

  for (const searchRoot of assetSearchRoots) {
    if (!(await pathExists(searchRoot))) {
      continue;
    }

    for await (const filePath of walkFiles(searchRoot)) {
      if (workspaceRoot && pathWithinRoot(workspaceRoot, filePath)) {
        continue;
      }

      const normalizedPath = filePath.replaceAll("\\", "/").toLowerCase();

      if (!normalizedPath.endsWith(fileName)) {
        continue;
      }

      if (normalizedPath.endsWith(normalizedSuffix) || path.basename(normalizedPath) === fileName) {
        matches.push(filePath);
      }
    }
  }

  return dedupe(matches).sort();
}

async function* walkFiles(rootDirectory) {
  const directory = await opendir(rootDirectory);

  for await (const entry of directory) {
    const entryPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(entryPath);
      continue;
    }

    if (entry.isFile()) {
      yield entryPath;
    }
  }
}

function buildPublicAssetDestinationPath(slug, originalReference, resolvedSourceAssetPath) {
  const normalizedReference = originalReference.replaceAll("\\", "/");

  if (WINDOWS_ABSOLUTE_PATH_PATTERN.test(originalReference) || path.isAbsolute(originalReference)) {
    const parentDirectoryName = path.basename(path.dirname(resolvedSourceAssetPath));
    return path.posix.join("content", slug, "absolute", parentDirectoryName, path.basename(resolvedSourceAssetPath));
  }

  const cleanedSegments = normalizedReference
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== ".");

  return path.posix.join("content", slug, ...cleanedSegments);
}

function registerPlannedDestination(plannedDestinations, destinationPath, sourceIdentity, destinationLabel) {
  const existingIdentity = plannedDestinations.get(destinationPath);

  if (existingIdentity && existingIdentity !== sourceIdentity) {
    throw new Error(`Conflicting destination mapping for ${destinationLabel}: ${existingIdentity} vs ${sourceIdentity}`);
  }

  plannedDestinations.set(destinationPath, sourceIdentity);
}

async function writeTextFileIfUnchangedOrMissing(destinationPath, content, workspaceRoot) {
  await mkdir(path.dirname(destinationPath), { recursive: true });

  if (await pathExists(destinationPath)) {
    const existingContent = await readFile(destinationPath, "utf8");

    if (existingContent !== content) {
      throw new Error(
        `Destination already exists with different content: ${path.relative(workspaceRoot, destinationPath).replaceAll("\\", "/")}`,
      );
    }

    return;
  }

  await writeFile(destinationPath, content, "utf8");
}

async function copyFileIfUnchangedOrMissing(sourcePath, destinationPath, workspaceRoot) {
  await mkdir(path.dirname(destinationPath), { recursive: true });

  if (await pathExists(destinationPath)) {
    const [existingBytes, sourceBytes] = await Promise.all([readFile(destinationPath), readFile(sourcePath)]);

    if (!existingBytes.equals(sourceBytes)) {
      throw new Error(
        `Destination already exists with different content: ${path.relative(workspaceRoot, destinationPath).replaceAll("\\", "/")}`,
      );
    }

    return;
  }

  await copyFile(sourcePath, destinationPath);
}

async function assertPathExists(filePath, errorMessage) {
  if (!(await pathExists(filePath))) {
    throw new Error(errorMessage);
  }
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function splitReferenceSuffix(reference) {
  const match = reference.match(/^([^?#]+)([?#].*)?$/);

  return {
    pathPart: match?.[1] ?? reference,
    suffix: match?.[2] ?? "",
  };
}

function assertPathWithinRoot(rootPath, candidatePath, contextLabel) {
  if (!pathWithinRoot(rootPath, candidatePath)) {
    throw new Error(`${contextLabel} escapes root boundary: ${candidatePath}`);
  }
}

function pathWithinRoot(rootPath, candidatePath) {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function parseAuthorProfileYaml(yamlSource) {
  const result = {
    authorinfo: {},
    contentinfo: {},
    oneself: {},
  };
  let currentSection = null;
  let currentCollection = null;

  for (const rawLine of yamlSource.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) {
      continue;
    }

    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    const line = rawLine.trim();

    if (indent === 0) {
      currentCollection = null;

      if (line.endsWith(":")) {
        currentSection = line.slice(0, -1);
        if (!result[currentSection]) {
          result[currentSection] = {};
        }
        continue;
      }

      const [key, value] = splitYamlKeyValue(line);
      result[key] = parseYamlScalar(value);
      currentSection = null;
      continue;
    }

    if (!currentSection) {
      continue;
    }

    if (indent === 2) {
      if (line.endsWith(":")) {
        currentCollection = line.slice(0, -1);

        if (currentCollection === "map") {
          result[currentSection][currentCollection] = {};
        } else {
          result[currentSection][currentCollection] = [];
        }

        continue;
      }

      currentCollection = null;
      const [key, value] = splitYamlKeyValue(line);
      result[currentSection][key] = parseYamlScalar(value);
      continue;
    }

    if (indent === 4 && currentCollection) {
      if (line.startsWith("- ")) {
        result[currentSection][currentCollection].push(parseYamlScalar(line.slice(2)));
        continue;
      }

      const [key, value] = splitYamlKeyValue(line);
      result[currentSection][currentCollection][key] = parseYamlScalar(value);
    }
  }

  return result;
}

function splitYamlKeyValue(line) {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    throw new Error(`Invalid YAML line: ${line}`);
  }

  return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()];
}

function parseYamlScalar(value) {
  if (value === "") {
    return "";
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

function normalizeAuthorProfile(rawProfile, source) {
  const normalizedProfile = {
    displayName: rawProfile.contentinfo?.name || rawProfile.title,
    siteTitle: rawProfile.title,
    introduction: rawProfile.contentinfo?.sup,
    headline: rawProfile.contentinfo?.title,
    slogan: rawProfile.contentinfo?.slogan,
    avatarUrl: rawProfile.authorinfo?.image,
    location: rawProfile.oneself?.location,
    birthYear: rawProfile.oneself?.birthYear,
    university: rawProfile.oneself?.university,
    major: rawProfile.oneself?.major,
    occupation: rawProfile.oneself?.occupation,
    profileTags: dedupe([...(rawProfile.authorinfo?.leftTags ?? []), ...(rawProfile.authorinfo?.rightTags ?? [])]),
    focusAreas: dedupe(rawProfile.contentinfo?.mask ?? []),
    source,
  };

  if (!normalizedProfile.displayName) {
    throw new Error(`Unable to normalize author profile from ${source.sourceRoot}:${source.sourcePath}`);
  }

  return removeUndefinedValues(normalizedProfile);
}

function removeUndefinedValues(input) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function dedupe(values) {
  return [...new Set(values)];
}

async function replaceAsync(input, pattern, replacer) {
  const matches = [...input.matchAll(pattern)];
  let lastIndex = 0;
  let output = "";

  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    output += input.slice(lastIndex, matchIndex);
    output += await replacer(...match);
    lastIndex = matchIndex + match[0].length;
  }

  output += input.slice(lastIndex);
  return output;
}

async function runCli() {
  try {
    const result = await importLaunchContent();
    process.stdout.write(`Imported ${result.importedSlugs.length} launch posts into content/ and public/content/.\n`);
    process.stdout.write(`Author profile: ${result.authorProfilePath}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runCli();
}
