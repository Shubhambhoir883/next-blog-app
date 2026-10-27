import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandIcon}>B</span>
        <span>
          Next<span className={styles.brandText}>Blog</span>
        </span>
      </Link>

      <nav className={styles.links}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/posts" className={`${styles.navLink} ${styles.activeNavLink}`}>
          Explore Posts
        </Link>
        <Link href="/posts" className={styles.ctaButton}>
          Browse Articles →
        </Link>
      </nav>
    </header>
  );
}
