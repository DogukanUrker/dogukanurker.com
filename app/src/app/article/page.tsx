import { getAllPosts, formatDate } from "@/lib/article";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Thoughts, tutorials, and insights on software development",
};

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Articles
          </h1>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-zinc-500">No posts yet. Check back soon!</p>
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
                  {/* Banner Image */}
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

                  {/* Title */}
                  <h2 className="text-2xl font-semibold text-zinc-100 transition-colors group-hover:text-zinc-50">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="line-clamp-2 text-base leading-relaxed text-zinc-400 group-hover:text-zinc-300">
                    {post.description}
                  </p>

                  {/* Meta */}
                  <p className="text-sm text-zinc-500">
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
