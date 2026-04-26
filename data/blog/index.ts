import { auPosts } from "./au";
import { ukPosts } from "./uk";
import { caPosts } from "./ca";
import { jpPosts } from "./jp";
import type { BlogPost } from "./types";

export type { BlogPost };

export const allPosts: BlogPost[] = [
  ...auPosts,
  ...ukPosts,
  ...caPosts,
  ...jpPosts,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export const allSlugs = allPosts.map((p) => p.slug);
