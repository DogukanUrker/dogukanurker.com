import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  extractHeadings,
} from "@/lib/article";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ShareButton } from "@/components/article/ShareButton";
import { ImageWithCaption } from "@/components/mdx";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Metadata } from "next";
import React from "react";

const components = {
  ImageWithCaption,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold" style={{ color: "var(--brand-ink)" }} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-4 mt-8 text-3xl font-semibold" style={{ color: "var(--brand-ink)" }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold" style={{ color: "var(--brand-ink)" }} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mb-2 mt-4 text-xl font-semibold" style={{ color: "var(--brand-ink)" }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7" style={{ color: "var(--brand-muted)" }} {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="underline underline-offset-4 transition-colors"
      style={{ color: "var(--brand-ink)", textDecorationColor: "var(--brand-border)" }}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" style={{ color: "var(--brand-muted)" }} {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" style={{ color: "var(--brand-muted)" }} {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 pl-6 italic"
      style={{ borderColor: "var(--brand-border)", color: "var(--brand-dim)" }}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    if (!props.className) {
      return (
        <code
          className="rounded px-1.5 py-0.5 text-sm" style={{ backgroundColor: "var(--brand-cream-subtle)", color: "var(--brand-ink)" }}
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border px-4 py-2 text-left font-semibold" style={{ borderColor: "var(--brand-border)", backgroundColor: "var(--brand-cream-subtle)", color: "var(--brand-ink)" }}
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2" style={{ borderColor: "var(--brand-border)", color: "var(--brand-muted)" }} {...props} />
  ),
  hr: () => <hr className="my-8" style={{ borderColor: "var(--brand-border)" }} />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    <Image
      src={props.src}
      alt={props.alt || "Article image"}
      width={800}
      height={600}
      className="my-6 rounded-lg border" style={{ borderColor: "var(--brand-border)" }}
    />
  ),
};

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const articleUrl = `https://dogukanurker.com/article/${slug}`;
  const ogImage = post.bannerImage || "https://dogukanurker.com/opengraph-image";

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "Dogukan Urker" }],
    creator: "Dogukan Urker",
    publisher: "Dogukan Urker",
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: articleUrl,
      siteName: "Dogukan Urker",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/png",
        },
      ],
      publishedTime: post.date,
      authors: ["Dogukan Urker"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: "@dogukanurker",
      site: "@dogukanurker",
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: !post.draft,
      follow: !post.draft,
      googleBot: {
        index: !post.draft,
        follow: !post.draft,
      },
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-cream)" }}>
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/article"
            className="text-sm transition-colors" style={{ color: "var(--brand-muted)" }}
          >
            Back to Articles
          </Link>

          <ShareButton url={`https://dogukanurker.com/article/${slug}`} />
        </div>

        <header className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "var(--brand-ink)" }}>
            {post.title}
          </h1>

          <p className="text-sm" style={{ color: "var(--brand-dim)" }}>
            {formatDate(post.date)} • {post.readingTime}
          </p>
        </header>

        {post.bannerImage && (
          <div className="mb-12">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-2xl" style={{ border: "1px solid var(--brand-border)" }}>
              <Image
                src={post.bannerImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-cream)]/10 to-transparent" />
            </div>
          </div>
        )}

        <div className="flex gap-12">
          <article className="min-w-0 flex-1">
            <div className="prose max-w-none">
              <MDXRemote
                source={post.content}
                components={components}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      rehypeHighlight,
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                          properties: {
                            className: ["anchor"],
                          },
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>
          </article>

          <aside className="hidden w-64 shrink-0 xl:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
