import Navbar from "@/components/Navbar";
import styles from "./posts.module.css";

export default function PostsLoading() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroDot} />
          Loading articles...
        </div>
        <h1 className={styles.heroTitle}>
          Insights, Stories &amp; <span className={styles.gradientText}>Ideas</span>
        </h1>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.postsGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
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
      </main>
    </div>
  );
}
