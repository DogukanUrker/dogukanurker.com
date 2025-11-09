import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slug } from "github-slugger";

const contentDirectory = path.join(process.cwd(), "..", "content", "article");

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  bannerImage: string;
  draft: boolean;
  content: string;
  readingTime: string;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  bannerImage: string;
  draft: boolean;
  readingTime: string;
}

/**
 * Get all articles sorted by date (newest first)
 * @param includeDrafts - Whether to include draft articles (default: false)
 */
export async function getAllPosts(
  includeDrafts: boolean = false
): Promise<ArticleMetadata[]> {
  try {
    // Check if content directory exists
    if (!fs.existsSync(contentDirectory)) {
      console.warn(`Content directory not found: ${contentDirectory}`);
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const posts = mdxFiles
      .map((filename) => {
        const filePath = path.join(contentDirectory, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);

        const slug = filename.replace(/\.mdx$/, "");
        const stats = readingTime(content);

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString(),
          description: data.description || "",
          bannerImage: data.bannerImage || "",
          draft: data.draft || false,
          readingTime: stats.text,
        } as ArticleMetadata;
      })
      .filter((post) => includeDrafts || !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

/**
 * Get a single article by slug
 * @param slug - The slug of the article
 */
export async function getPostBySlug(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const stats = readingTime(content);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      description: data.description || "",
      bannerImage: data.bannerImage || "",
      draft: data.draft || false,
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}

/**
 * Format date to a readable string
 * @param dateString - ISO date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Extract headings from MDX content for table of contents
 * @param content - MDX content string
 */
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): Heading[] {
  // First, remove all code blocks (both fenced and inline) to avoid matching # inside them
  const contentWithoutCodeBlocks = content
    // Remove fenced code blocks (```...```)
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code (`...`)
    .replace(/`[^`]+`/g, "");

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Use github-slugger to ensure ID matches what rehypeSlug generates
    const id = slug(text);

    headings.push({ id, text, level });
  }

  return headings;
}

