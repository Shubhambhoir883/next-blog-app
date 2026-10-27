import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/api";
import styles from "./page.module.css";

export default async function Home() {
  // Fetch top 3 featured posts for the landing preview
  const data = await getPosts({ limit: 3, skip: 0 });
  const featuredPosts = data.posts;

  return (
    <div className={styles.homeContainer}>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.badge}>Next.js 16 • Server-Side Rendered Blog</div>
          <h1 className={styles.title}>
            Discover Ideas That <span className={styles.gradient}>Matter</span>
          </h1>
          <p className={styles.description}>
            A fast, responsive blog application built with Next.js Server Components,
            fetching live dynamic articles, tags, and reader engagement metrics from DummyJSON.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/posts" className={styles.primaryCta}>
              Explore All Posts ({data.total}) →
            </Link>
            <a
              href="https://dummyjson.com/docs/posts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
            >
              DummyJSON API Docs ↗
            </a>
          </div>
        </section>

        {/* Featured Preview Section */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Stories</h2>
              <p className={styles.sectionSubtitle}>
                Hand-picked highlights from the live server-rendered feed.
              </p>
            </div>
            <Link href="/posts" className={styles.viewAllLink}>
              View all {data.total} stories →
            </Link>
          </div>

          <div className={styles.grid}>
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>NextBlog • Powered by Next.js Server Components &amp; DummyJSON</p>
      </footer>
    </div>
  );
}
