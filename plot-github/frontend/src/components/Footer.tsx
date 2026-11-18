import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.main}>
          <Link href="/" className={styles.brand} aria-label="PLOT home">
            <img src="/footer-logo.webp" alt="PLOT Real Estate & Development" width={760} height={259} />
          </Link>
          <address className={styles.contact}>
            <span>Hargeisa, Somaliland</span>
            <a href="mailto:info@plotdevelopments.com">info@plotdevelopments.com</a>
            <a href="https://wa.me/252638339599">WhatsApp · +252 63 833 9599</a>
          </address>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
