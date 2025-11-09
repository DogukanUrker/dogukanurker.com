import { getAllPosts, formatDate } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on software development",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Blog
          </h1>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-zinc-500">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                  {/* Banner Image */}
                  {post.bannerImage && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.bannerImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex h-full flex-col p-6">
                    {/* Title */}
                    <h2 className="mb-3 text-xl font-semibold text-zinc-100 group-hover:text-zinc-50">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">
                      {post.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <time>{formatDate(post.date)}</time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
