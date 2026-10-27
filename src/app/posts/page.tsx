import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getPosts, getPopularTags } from "@/lib/api";
import styles from "./posts.module.css";

export const metadata: Metadata = {
  title: "Explore Stories & Articles | NextBlog",
  description:
    "Server-rendered blog feed featuring live articles, reactions, tags, and reading stats powered by DummyJSON.",
};

export const instant = false;

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    q?: string;
  }>;
}

const POSTS_PER_PAGE = 9;

// Loading Skeleton Component
function PostsFeedSkeleton() {
  return (
    <div className={styles.postsGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonBadge} />
            <div className={styles.skeletonTime} />
          </div>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonExcerpt}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
          </div>
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonMetric} />
            <div className={styles.skeletonTime} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Server Component for fetching and rendering posts
async function PostsFeed({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const activeTag =
    typeof params.tag === "string" ? params.tag.trim() : undefined;
  const searchQuery =
    typeof params.q === "string" ? params.q.trim() : undefined;

  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const postsData = await getPosts({
    limit: POSTS_PER_PAGE,
    skip,
    tag: activeTag,
    query: searchQuery,
  });

  const { posts, total } = postsData;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const buildPageUrl = (pageNumber: number) => {
    const query = new URLSearchParams();
    if (pageNumber > 1) query.set("page", pageNumber.toString());
    if (activeTag) query.set("tag", activeTag);
    if (searchQuery) query.set("q", searchQuery);
    const queryString = query.toString();
    return queryString ? `/posts?${queryString}` : "/posts";
  };

  return (
    <>
      {/* Results Metadata & Clear Filters */}
      <div className={styles.resultsMeta}>
        <div className={styles.resultsCount}>
          Showing <strong>{posts.length}</strong> of <strong>{total}</strong>{" "}
          articles
          {activeTag && (
            <span>
              {" "}
              in <em>#{activeTag}</em>
            </span>
          )}
          {searchQuery && (
            <span>
              {" "}
              matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
            </span>
          )}
        </div>

        {(activeTag || searchQuery) && (
          <div className={styles.filterBadgeGroup}>
            <Link href="/posts" className={styles.clearFilterLink}>
              ✕ Reset Filters
            </Link>
          </div>
        )}
      </div>

      {/* Posts Grid or Empty State */}
      {posts.length > 0 ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No articles found</h3>
          <p className={styles.emptyText}>
            We couldn&apos;t find any stories matching your criteria. Try
            adjusting your search term or exploring another tag.
          </p>
          <Link href="/posts" className={styles.resetBtn}>
            View All Articles
          </Link>
        </div>
      )}

      {/* Server-Side Pagination Controls */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          <Link
            href={buildPageUrl(currentPage - 1)}
            className={`${styles.pageButton} ${
              currentPage <= 1 ? styles.disabledButton : ""
            }`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            ← Previous
          </Link>

          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <Link
            href={buildPageUrl(currentPage + 1)}
            className={`${styles.pageButton} ${
              currentPage >= totalPages ? styles.disabledButton : ""
            }`}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            Next →
          </Link>
        </nav>
      )}
    </>
  );
}

// Static/Prerendered Tag Bar
async function TagsFilterBar() {
  const popularTags = await getPopularTags();

  return (
    <div className={styles.tagsFilterBar}>
      <Link href="/posts" className={styles.tagFilterPill}>
        All Stories
      </Link>
      {popularTags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/posts?tag=${encodeURIComponent(tag.slug)}`}
          className={styles.tagFilterPill}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}

export default function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* Hero Section (Prerendered) */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroDot} />
          Server-Side Rendered • Live DummyJSON Posts API
        </div>

        <h1 className={styles.heroTitle}>
          Insights, Stories &amp;{" "}
          <span className={styles.gradientText}>Ideas</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Browse thought-provoking articles across tech, culture, and fiction
          with real-time reaction counts and views.
        </p>

        {/* Search Bar Form */}
        <form action="/posts" method="GET" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            placeholder="Search articles by title or keyword..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </form>

        {/* <Suspense fallback={<div style={{ minHeight: "36px" }} />}> */}
        <TagsFilterBar />
        {/* </Suspense> */}
      </section>

      {/* Main Content Area with Suspense boundary */}
      <main className={styles.mainContent}>
        {/* <Suspense fallback={<PostsFeedSkeleton />}> */}
        <PostsFeed searchParams={searchParams} />
        {/* </Suspense> */}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          NextBlog • Built with Next.js Server Components &amp; DummyJSON API •
          2026
        </p>
      </footer>
    </div>
  );
}
