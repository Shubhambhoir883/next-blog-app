import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getPostById } from "@/lib/api";
import styles from "./post-detail.module.css";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export const instant = false;


export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: "Post Not Found | NextBlog",
    };
  }

  return {
    title: `${post.title} | NextBlog`,
    description: post.body.slice(0, 150),
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const wordCount = post.body.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 40));

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.articleWrapper}>
        <Link href="/posts" className={styles.backLink}>
          ← Back to all stories
        </Link>

        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.storyBadge}>Story #{post.id}</span>
            <span className={styles.readingTime}>{readingTime} min read</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.statsBar}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>U{post.userId}</div>
              <div className={styles.authorMeta}>
                <span className={styles.authorName}>Author #{post.userId}</span>
                <span className={styles.authorRole}>DummyJSON Contributor</span>
              </div>
            </div>

            <div className={styles.reactionsGroup}>
              <span className={`${styles.reactionItem} ${styles.likes}`} title="Likes">
                👍 {post.reactions?.likes ?? 0}
              </span>
              <span className={`${styles.reactionItem} ${styles.dislikes}`} title="Dislikes">
                👎 {post.reactions?.dislikes ?? 0}
              </span>
              <span className={`${styles.reactionItem} ${styles.views}`} title="Total Views">
                👁️ {post.views ?? 0} views
              </span>
            </div>
          </div>
        </header>

        <article className={styles.bodyContent}>{post.body}</article>

        {post.tags && post.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <span className={styles.tagLabel}>Tags:</span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className={styles.tagPill}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
