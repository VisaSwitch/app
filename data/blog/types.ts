export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;       // 150-160 chars — used as meta description
  publishedAt: string;   // ISO date string e.g. "2025-04-01"
  updatedAt: string;
  category: string;      // e.g. "Working Holiday", "Skilled Migration", "PR Pathway"
  country?: "au" | "uk" | "ca" | "jp";   // omit for multi-country posts
  tags: string[];
  readingTime: number;   // minutes
  content: string;       // markdown source
}
