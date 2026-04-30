import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Visa Guides & Immigration Blog",
  description:
    "In-depth guides on working holiday visas, skilled migration, student visas and PR pathways for Australia, UK, Canada and Japan. Up-to-date fees, requirements and step-by-step advice.",
  openGraph: {
    title: "Visa Guides & Immigration Blog | VisaSwitch",
    description:
      "In-depth guides on working holiday visas, skilled migration, student visas and PR pathways for Australia, UK, Canada and Japan.",
    type: "website",
  },
};

const COUNTRY_NAMES: Record<string, string> = {
  au: "Australia",
  uk: "United Kingdom",
  ca: "Canada",
  jp: "Japan",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Working Holiday": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Skilled Migration": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Employer Sponsored": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Family Visa": "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  "Post-Study Work": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "PR Pathway": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Settlement: "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
  "Work Visa": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Skilled Worker": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  // Group posts by country
  const countries = ["au", "uk", "ca", "jp"];
  const byCountry: Record<string, typeof allPosts> = {};
  for (const c of countries) {
    byCountry[c] = allPosts.filter((p) => p.country === c);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>
          Guides
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--foreground)" }}>
          Visa Guides & Immigration Blog
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          In-depth, up-to-date guides on every major visa pathway for Australia, the UK, Canada, and Japan — fees, requirements, processing times, and step-by-step advice.
        </p>
      </div>

      {/* Featured — most recent */}
      {allPosts[0] && (
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>
            Latest
          </p>
          <Link
            href={`/blog/${allPosts[0].slug}`}
            className="group block rounded-2xl border p-7 transition-all hover:shadow-lg"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[allPosts[0].category] ?? "bg-gray-100 text-gray-700"}`}
              >
                {allPosts[0].category}
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {formatDate(allPosts[0].publishedAt)} · {allPosts[0].readingTime} min read
              </span>
            </div>
            <h2
              className="text-2xl font-bold leading-snug mb-3 group-hover:opacity-80 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              {allPosts[0].title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {allPosts[0].excerpt}
            </p>
          </Link>
        </div>
      )}

      {/* Posts by country */}
      {countries.map((code) => {
        const posts = byCountry[code];
        if (!posts || posts.length === 0) return null;
        return (
          <section key={code} className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {COUNTRY_NAMES[code]}
              </h2>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {posts.length} guide{posts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border p-5 transition-all hover:shadow-md"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <div className="mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-sm leading-snug mb-2 flex-1 group-hover:opacity-75 transition-opacity"
                    style={{ color: "var(--foreground)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-4 line-clamp-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-auto" style={{ color: "var(--muted-foreground)" }}>
                    <span>{post.readingTime} min</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

    </div>
  );
}
