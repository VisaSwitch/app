import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { getPostBySlug, allSlugs, allPosts } from "@/data/blog";
import { renderMarkdown } from "@/lib/render-markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

const COUNTRY_NAMES: Record<string, string> = {
  au: "Australia",
  uk: "United Kingdom",
  ca: "Canada",
  jp: "Japan",
};

const COUNTRY_CODES: Record<string, string> = {
  au: "au",
  uk: "uk",
  ca: "ca",
  jp: "jp",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  // Related posts — same country, exclude self, max 3
  const related = allPosts
    .filter((p) => p.country === post.country && p.slug !== post.slug)
    .slice(0, 3);

  const countryCode = post.country ? COUNTRY_CODES[post.country] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All guides
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.country && (
            <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
              {COUNTRY_NAMES[post.country]}
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
            {post.category}
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
          style={{ color: "var(--foreground)" }}
        >
          {post.title}
        </h1>

        <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-sm border-b pb-6"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
          {post.updatedAt !== post.publishedAt && (
            <span className="text-xs">Updated {formatDate(post.updatedAt)}</span>
          )}
        </div>
      </header>

      {/* Body */}
      <article
        className="prose-content max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <Tag className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA — link to the relevant country tool */}
      {countryCode && (
        <div
          className="rounded-2xl border p-6 mb-10"
          style={{ background: "var(--muted)", borderColor: "var(--border)" }}
        >
          <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
            Ready to check your options?
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
            Use VisaSwitch tools to check pathways, build your checklist, and audit your risk — for free.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${countryCode}/guide`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Start your visa guide →
            </Link>
          </div>
        </div>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--foreground)" }}>
            More {post.country ? COUNTRY_NAMES[post.country] : ""} guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group block rounded-xl border p-4 transition-all hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <span className="text-xs font-medium block mb-2" style={{ color: "var(--muted-foreground)" }}>
                  {rp.category}
                </span>
                <p className="text-sm font-semibold leading-snug group-hover:opacity-75 transition-opacity"
                  style={{ color: "var(--foreground)" }}>
                  {rp.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
