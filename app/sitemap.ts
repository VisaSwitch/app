import type { MetadataRoute } from "next";
import { allPosts } from "@/data/blog";

const BASE_URL = "https://visaswitch.app";
const COUNTRIES = ["au", "uk", "ca", "jp"];
const COUNTRY_PAGES = ["guide", "pathways", "audit", "planner", "recovery"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const countryRoutes: MetadataRoute.Sitemap = COUNTRIES.flatMap((code) => [
    { url: `${BASE_URL}/${code}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    ...COUNTRY_PAGES.map((page) => ({
      url: `${BASE_URL}/${code}/${page}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);

  const blogRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...countryRoutes, ...blogRoutes];
}
