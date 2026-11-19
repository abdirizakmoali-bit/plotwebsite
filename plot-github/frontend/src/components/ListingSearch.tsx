import type { SaleCategory } from "@/lib/listings";
import styles from "./ListingSearch.module.css";

export function ListingSearch({ category = "all", query = "" }: { category?: SaleCategory; query?: string }) {
  return (
    <form className={styles.search} action="/buy/" method="get" role="search" aria-label="Property and land for sale">
      <label className={styles.field}>
        <span>Listing type</span>
        <select name="category" defaultValue={category}>
          <option value="all">All listings</option>
          <option value="property">Property</option>
          <option value="land">Land</option>
        </select>
      </label>
      <label className={styles.field}>
        <span>Location or keyword</span>
        <input type="search" name="q" maxLength={120} defaultValue={query} placeholder="e.g. Jigjiga Yar or bungalow" />
      </label>
      <button type="submit"><span className={styles.glass} aria-hidden="true" />Search</button>
    </form>
  );
}
