import { getPostBySlug, getAllPosts, formatDate, extractHeadings } from "@/lib/article";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { Callout, Timeline, TimelineItem, ImageWithCaption } from "@/components/mdx";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Metadata } from "next";

// MDX Components
const components = {
  Callout,
  Timeline,
  TimelineItem,
  ImageWithCaption,
  // Style default elements
  h1: (props: any) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold text-zinc-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 mt-8 text-3xl font-semibold text-zinc-100" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold text-zinc-200" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="mb-2 mt-4 text-xl font-semibold text-zinc-200" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-7 text-zinc-300" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-blue-400 underline decoration-blue-400/30 underline-offset-4 transition-colors hover:text-blue-300 hover:decoration-blue-300/50"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-zinc-300" {...props} />
  ),
  li: (props: any) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-6 border-l-4 border-zinc-700 pl-6 italic text-zinc-400"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm"
      {...props}
    />
  ),
  code: (props: any) => {
    // Inline code
    if (!props.className) {
      return (
        <code
          className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-300"
          {...props}
        />
      );
    }
    // Code block (handled by pre)
    return <code {...props} />;
  },
  table: (props: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-zinc-800 bg-zinc-900 px-4 py-2 text-left font-semibold text-zinc-200"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-zinc-800 px-4 py-2 text-zinc-300" {...props} />
  ),
  hr: () => <hr className="my-8 border-zinc-800" />,
  img: (props: any) => (
    <Image
      {...props}
      width={800}
      height={600}
      className="my-6 rounded-lg border border-zinc-800"
      alt={props.alt || ""}
    />
  ),
};

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.bannerImage ? [post.bannerImage] : [],
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
    <div className="min-h-screen bg-zinc-950">
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      {/* Banner Image */}
      {post.bannerImage && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-800">
          <Image
            src={post.bannerImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/article"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Articles
        </Link>

        {/* Main Content Area */}
        <div className="flex gap-12">
          {/* Article */}
          <article className="min-w-0 flex-1">
            {/* Header */}
            <header className="mb-8 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </header>

            {/* MDX Content */}
            <div className="prose prose-invert max-w-none">
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

          {/* Table of Contents - Desktop Only */}
          <aside className="hidden w-64 shrink-0 xl:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
