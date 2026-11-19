"use client";

import { useEffect, useState } from "react";
import { type SaleCategory, whatsApp } from "@/lib/listings";
import styles from "@/app/plots/plots.module.css";

const kinds = { land: "Land", house: "House", apartment: "Apartment", commercial: "Commercial property", other: "Property" };
type Listing = {
  id: number;
  kind: keyof typeof kinds;
  title: string;
  location: string;
  area_m2: string;
  dimensions: string;
  price_usd: string | null;
  description: string;
  photo_url: string;
};
type Result = { status: "ready"; listings: Listing[] } | { status: "loading" | "error" };
const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

function ListingCard({ listing }: { listing: Listing }) {
  const land = listing.kind === "land";
  const reference = `PLOT-${land ? "L" : "P"}${listing.id}`;
  const enquiry = `Hello PLOT, I’m interested in ${listing.title} in ${listing.location} (ref. ${reference}). Could you share the details and arrange a site visit?`;
  return (
    <article className={styles.card}>
      {listing.photo_url && <img src={listing.photo_url} alt={listing.title + " in " + listing.location} loading="lazy" />}
      <div className={styles.cardBody}>
        <p className={styles.meta}>{kinds[listing.kind]} · {listing.location} · {reference}</p>
        <h3>{listing.title}</h3>
        <dl className={styles.facts}>
          <div><dt>Area</dt><dd>{number.format(Number(listing.area_m2))} m²</dd></div>
          {listing.dimensions && <div><dt>Dimensions</dt><dd>{listing.dimensions}</dd></div>}
          <div><dt>Asking price</dt><dd>{listing.price_usd ? "US$" + number.format(Number(listing.price_usd)) : "On request"}</dd></div>
        </dl>
        {listing.description && <p className={styles.description}>{listing.description}</p>}
        <a href={whatsApp(enquiry)} className={styles.link}>Enquire about this {land ? "plot" : "property"}</a>
      </div>
    </article>
  );
}

export function SaleListings({ category, query = "", landPage = false }: { category: SaleCategory; query?: string; landPage?: boolean }) {
  const [result, setResult] = useState<Result>({ status: api ? "loading" : "error" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!api) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    async function load() {
      try {
        const params = new URLSearchParams({ category, q: query });
        const response = await fetch(api + "/api/listings/?" + params, { signal: controller.signal, credentials: "omit" });
        if (!response.ok) throw new Error("Catalogue unavailable");
        const data = await response.json();
        if (!Array.isArray(data.listings)) throw new Error("Invalid catalogue");
        if (active) setResult({ status: "ready", listings: data.listings });
      } catch {
        if (active) setResult({ status: "error" });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [attempt, category, query]);

  if (result.status === "ready" && result.listings.length > 0) {
    return <>
      {!landPage && <p role="status" className={styles.meta}>{result.listings.length} {result.listings.length === 1 ? "listing" : "listings"} found</p>}
      <div className={styles.cards}>{result.listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}</div>
    </>;
  }
  const subject = { all: "property or land", land: "land", property: "a property" }[category];
  const enquiry = `Hello PLOT, I’m looking for ${subject} in Hargeisa.${query ? " My search was “" + query + "”." : ""} Could you share suitable listings?`;
  const filtered = Boolean(query) || category !== "all";
  return (
    <div className={styles.notice} role="status">
      {result.status === "loading" && "Loading available listings…"}
      {result.status === "ready" && (landPage ? "There are no plots listed for sale at the moment. Share your preferences and ask us about upcoming listings."
        : filtered ? "No available listings match your search." : "There are no properties or plots listed for sale at the moment.")}
      {result.status === "error" && <>
        We couldn’t load the listings. You can still ask us about availability on WhatsApp.
        {api && <button type="button" className={styles.link} onClick={() => { setResult({ status: "loading" }); setAttempt(n => n + 1); }}>Try again</button>}
      </>}
      {!landPage && result.status !== "loading" && <div className={styles.emptyActions}>
        {filtered && <a className={styles.link} href="/buy/">View all listings</a>}
        <a className={styles.link} href={whatsApp(enquiry)}>Ask PLOT on WhatsApp</a>
      </div>}
    </div>
  );
}
