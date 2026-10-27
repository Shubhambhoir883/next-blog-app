import Link from "next/link";
import { Post } from "@/types/blog";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Estimate reading time (~200 words per minute)
  const wordCount = post.body.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 40));

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.postBadge}>Story #{post.id}</span>
        <span className={styles.readingTime}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readingTime} min read
        </span>
      </div>

      <h2 className={styles.title}>
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h2>

      <p className={styles.excerpt}>{post.body}</p>

      {post.tags && post.tags.length > 0 && (
        <div className={styles.tagsContainer}>
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

      <div className={styles.cardFooter}>
        <div className={styles.metrics}>
          {/* Likes */}
          <span className={`${styles.metricItem} ${styles.likeCount}`} title="Likes">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {post.reactions?.likes ?? 0}
          </span>

          {/* Dislikes */}
          <span className={`${styles.metricItem} ${styles.dislikeCount}`} title="Dislikes">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
            {post.reactions?.dislikes ?? 0}
          </span>

          {/* Views */}
          <span className={`${styles.metricItem} ${styles.viewCount}`} title="Total Views">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {post.views ?? 0}
          </span>
        </div>

        <Link href={`/posts/${post.id}`} className={styles.readMoreBtn}>
          Read story →
        </Link>
      </div>
    </article>
  );
}
