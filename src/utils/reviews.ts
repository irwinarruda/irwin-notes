import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/utils/i18n";

const REVIEWS_DIRECTORY = path.join(process.cwd(), "src/content/reviews");
const POSTS_DIRECTORY = path.join(process.cwd(), "src/content/posts");

export type ReviewNote = {
  typeOfNote: string;
  note: string;
  explanation: string;
};

export type ReviewSuggestion = {
  position: string;
  suggestedText: string;
};

export type ReviewData = {
  name: string;
  notes: ReviewNote[];
  suggestions: ReviewSuggestion[];
};

async function readDirectorySafe(directory: string): Promise<string[]> {
  try {
    return await readdir(directory);
  } catch {
    return [];
  }
}

export const getAllReviewSlugs = cache(
  async (locale: Locale): Promise<string[]> => {
    const slugs = new Set<string>();

    const defaultEntries = await readDirectorySafe(
      path.join(REVIEWS_DIRECTORY, DEFAULT_LOCALE),
    );
    for (const entry of defaultEntries) {
      if (entry.endsWith(".json")) {
        slugs.add(entry.replace(/\.json$/, ""));
      }
    }

    if (locale !== DEFAULT_LOCALE) {
      const localeEntries = await readDirectorySafe(
        path.join(REVIEWS_DIRECTORY, locale),
      );
      for (const entry of localeEntries) {
        if (entry.endsWith(".json")) {
          slugs.add(entry.replace(/\.json$/, ""));
        }
      }
    }

    return [...slugs];
  },
);

export const getReviewData = cache(
  async (locale: Locale, slug: string): Promise<ReviewData | null> => {
    // Try locale-specific first, then fall back to default
    const candidates =
      locale === DEFAULT_LOCALE
        ? [DEFAULT_LOCALE]
        : [locale, DEFAULT_LOCALE];

    for (const loc of candidates) {
      try {
        const filePath = path.join(REVIEWS_DIRECTORY, loc, `${slug}.json`);
        const content = await readFile(filePath, "utf8");
        return JSON.parse(content);
      } catch {
        continue;
      }
    }
    return null;
  },
);

export async function getRawPostContent(
  locale: Locale,
  fileName: string,
): Promise<string | null> {
  const candidates =
    locale === DEFAULT_LOCALE
      ? [DEFAULT_LOCALE]
      : [locale, DEFAULT_LOCALE];
  for (const loc of candidates) {
    try {
      const filePath = path.join(POSTS_DIRECTORY, loc, fileName);
      return await readFile(filePath, "utf8");
    } catch {
      continue;
    }
  }
  return null;
}
