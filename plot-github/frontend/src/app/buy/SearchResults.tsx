"use client";

import { useSearchParams } from "next/navigation";
import { ListingSearch } from "@/components/ListingSearch";
import { SaleListings } from "@/components/SaleListings";
import styles from "./buy.module.css";

export function SearchResults() {
  const params = useSearchParams();
  const value = params.get("category");
  const category = value === "land" || value === "property" ? value : "all";
  const query = (params.get("q") || "").trim().slice(0, 120);
  const key = category + ":" + query;
  return <>
    <ListingSearch key={key} category={category} query={query} />
    <section className={styles.results} aria-labelledby="results-title">
      <h2 id="results-title">{category === "land" ? "Available land" : category === "property" ? "Available properties" : "Available listings"}{query && <> matching “{query}”</>}</h2>
      <SaleListings key={key} category={category} query={query} />
    </section>
  </>;
}
