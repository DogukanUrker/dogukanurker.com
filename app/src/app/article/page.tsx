import { getAllPosts, formatDate } from "@/lib/article";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Explore articles about software engineering, web development, and programming best practices.",
  openGraph: {
    type: 'website',
    title: "Articles | Dogukan Urker",
    description: "Explore articles about software engineering, web development, and programming best practices.",
    url: 'https://dogukanurker.com/article',
    siteName: 'Dogukan Urker',
    locale: 'en_US',
    images: [
      {
        url: 'https://dogukanurker.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Dogukan Urker - Articles',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Articles | Dogukan Urker",
    description: "Explore articles about software engineering, web development, and programming best practices.",
    images: ['https://dogukanurker.com/opengraph-image'],
    creator: '@dogukanurker',
    site: '@dogukanurker',
  },
  alternates: {
    canonical: 'https://dogukanurker.com/article',
  },
};

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--brand-ink)" }}>
            Articles
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p style={{ color: "var(--brand-muted)" }}>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/article/${post.slug}`}
                className="group block"
              >
                <article className="space-y-4">
                  {post.bannerImage && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={post.bannerImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <h2 className="text-2xl font-semibold transition-colors" style={{ color: "var(--brand-ink)" }}>
                    {post.title}
                  </h2>

                  <p className="line-clamp-2 text-base leading-relaxed" style={{ color: "var(--brand-muted)" }}>
                    {post.description}
                  </p>

                  <p className="text-sm" style={{ color: "var(--brand-dim)" }}>
                    {formatDate(post.date)} • {post.readingTime}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
