import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { DEFAULT_LOCALE, type Locale } from "@/utils/i18n";

const POSTS_DIRECTORY = path.join(process.cwd(), "src/content/posts");
const SUPPORTED_EXTENSIONS = [".md", ".mdx"] as const;

export type PostReference = {
  label: string;
  url: string;
};

export type Post = {
  locale: Locale;
  contentLocale: Locale;
  slug: string;
  extension: "md" | "mdx";
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  draft: boolean;
  references: PostReference[];
};

type PostFileSource = {
  fileName: string;
  fullPath: string;
  contentLocale: Locale;
};

type PostFrontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  tags?: unknown;
  readTime?: unknown;
  draft?: unknown;
  references?: unknown;
};

function isSupportedPostFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

function getPostSlug(fileName: string): string {
  return fileName.replace(/\.(md|mdx)$/, "");
}

function getPostExtension(fileName: string): Post["extension"] {
  return fileName.endsWith(".mdx") ? "mdx" : "md";
}

function assertString(value: unknown, fieldName: string, slug: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid frontmatter field '${fieldName}' in '${slug}'.`);
  }

  return value;
}

function normalizeDate(value: unknown, slug: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return assertString(value, "date", slug);
}

function toTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min`;
}

function toReferences(value: unknown): PostReference[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is PostReference =>
      typeof item === "object" &&
      item !== null &&
      typeof item.label === "string" &&
      typeof item.url === "string",
  );
}

function toDescription(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 177)}...`;
}

async function readPostFromFile(
  fileSource: PostFileSource,
  locale: Locale,
): Promise<Post> {
  const { fileName, fullPath, contentLocale } = fileSource;
  const fileContents = await readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const frontmatter = data as PostFrontmatter;
  const slug = getPostSlug(fileName);

  return {
    locale,
    contentLocale,
    slug,
    extension: getPostExtension(fileName),
    title: assertString(frontmatter.title, "title", slug),
    description:
      typeof frontmatter.description === "string"
        ? frontmatter.description
        : toDescription(content),
    date: normalizeDate(frontmatter.date, slug),
    tags: toTags(frontmatter.tags),
    readTime:
      typeof frontmatter.readTime === "string"
        ? frontmatter.readTime
        : estimateReadTime(content),
    draft: frontmatter.draft === true,
    references: toReferences(frontmatter.references),
  };
}

async function readPostDirectory(directory: string): Promise<string[]> {
  try {
    return await readdir(directory);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

function getLocalePostsDirectory(locale: Locale): string {
  return path.join(POSTS_DIRECTORY, locale);
}

async function getPostFileSources(locale: Locale): Promise<PostFileSource[]> {
  const sourceBySlug = new Map<string, PostFileSource>();

  const defaultLocaleDirectory = getLocalePostsDirectory(DEFAULT_LOCALE);
  const defaultLocaleEntries = await readPostDirectory(defaultLocaleDirectory);
  for (const fileName of defaultLocaleEntries.filter(isSupportedPostFile)) {
    sourceBySlug.set(getPostSlug(fileName), {
      fileName,
      fullPath: path.join(defaultLocaleDirectory, fileName),
      contentLocale: DEFAULT_LOCALE,
    });
  }

  if (locale === DEFAULT_LOCALE) {
    return [...sourceBySlug.values()];
  }

  const localeDirectory = getLocalePostsDirectory(locale);
  const localeEntries = await readPostDirectory(localeDirectory);

  for (const fileName of localeEntries.filter(isSupportedPostFile)) {
    sourceBySlug.set(getPostSlug(fileName), {
      fileName,
      fullPath: path.join(localeDirectory, fileName),
      contentLocale: locale,
    });
  }

  return [...sourceBySlug.values()];
}

export const getAllPosts = cache(async (locale: Locale): Promise<Post[]> => {
  const fileSources = await getPostFileSources(locale);
  const posts = await Promise.all(
    fileSources.map((fileSource) => readPostFromFile(fileSource, locale)),
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});

export const getPostBySlug = cache(
  async (locale: Locale, slug: string): Promise<Post | null> => {
    const posts = await getAllPosts(locale);
    return posts.find((post) => post.slug === slug) ?? null;
  },
);

export async function getPostComponent(
  post: Post,
): Promise<React.ComponentType> {
  const postModule = await import(
    `@/content/posts/${post.contentLocale}/${post.slug}.${post.extension}`
  );

  return postModule.default;
}
