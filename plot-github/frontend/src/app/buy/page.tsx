import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSearch } from "@/components/ListingSearch";
import { SearchResults } from "./SearchResults";
import styles from "./buy.module.css";

export const metadata: Metadata = {
  title: "Property and land for sale in Hargeisa",
  description: "Find available homes, commercial properties and plots for sale in Hargeisa. Search by neighbourhood or keyword.",
  alternates: { canonical: "/buy/" },
};

export default function BuyPage() {
  return <div className={styles.page}>
    <div className="shell">
      <header><p>Hargeisa, Somaliland</p><h1>Property &amp; land for sale.</h1></header>
      <Suspense fallback={<><ListingSearch /><p role="status">Loading available listings…</p></>}>
        <SearchResults />
      </Suspense>
    </div>
  </div>;
}
