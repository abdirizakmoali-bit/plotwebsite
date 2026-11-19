"use client";

import { useEffect, useState } from "react";
import styles from "./plots.module.css";

type Plot = {
  id: number;
  title: string;
  location: string;
  area_m2: string;
  dimensions: string;
  price_usd: string | null;
  description: string;
  photo_url: string;
};

const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

function whatsApp(message: string) {
  return "https://wa.me/252638339599?text=" + encodeURIComponent(message);
}

function PlotCard({ plot }: { plot: Plot }) {
  const reference = `PLOT-L${plot.id}`;
  const enquiry = `Hello PLOT, I’m interested in ${plot.title} in ${plot.location} (ref. ${reference}). Could you share the details and arrange a site visit?`;
  return (
    <article className={styles.card}>
      {plot.photo_url && <img src={plot.photo_url} alt={plot.title + " in " + plot.location} loading="lazy" />}
      <div className={styles.cardBody}>
        <p className={styles.meta}>{plot.location} · {reference}</p>
        <h3>{plot.title}</h3>
        <dl className={styles.facts}>
          <div><dt>Area</dt><dd>{number.format(Number(plot.area_m2))} m²</dd></div>
          {plot.dimensions && <div><dt>Dimensions</dt><dd>{plot.dimensions}</dd></div>}
          <div><dt>Asking price</dt><dd>{plot.price_usd ? "US$" + number.format(Number(plot.price_usd)) : "On request"}</dd></div>
        </dl>
        {plot.description && <p className={styles.description}>{plot.description}</p>}
        <a href={whatsApp(enquiry)} className={styles.link}>Enquire about this plot</a>
      </div>
    </article>
  );
}

export function PlotCatalogue() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(api ? "loading" : "error");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!api) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    async function load() {
      try {
        const response = await fetch(api + "/api/plots/", { signal: controller.signal, credentials: "omit" });
        if (!response.ok) throw new Error("Catalogue unavailable");
        const data = await response.json();
        if (!Array.isArray(data.plots)) throw new Error("Invalid catalogue");
        if (active) { setPlots(data.plots); setStatus("ready"); }
      } catch {
        if (active) setStatus("error");
      } finally {
        window.clearTimeout(timeout);
      }
    }
    load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  if (status === "ready" && plots.length) {
    return <div className={styles.cards}>{plots.map(plot => <PlotCard key={plot.id} plot={plot} />)}</div>;
  }

  return (
    <div className={styles.notice} role="status">
      {status === "loading" && "Loading available plots…"}
      {status === "ready" && "There are no plots listed for sale at the moment. Share your preferences and ask us about upcoming listings."}
      {status === "error" && <>
        We couldn’t load the listings. You can still ask us about availability on WhatsApp.
        {api && <button type="button" className={styles.link} onClick={() => { setStatus("loading"); setAttempt(n => n + 1); }}>Try again</button>}
      </>}
    </div>
  );
}

export function PlotSearchBrief() {
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState("");
  const lines = [
    "Hello PLOT, I’m looking for land in Hargeisa. Could you share suitable plots?",
    location.trim() && "Preferred area: " + location.trim(),
    size.trim() && "Plot size: " + size.trim(),
    budget.trim() && "Budget (USD): " + budget.trim(),
  ];
  return (
    <div className={styles.fields}>
      <label>Preferred area<input maxLength={100} placeholder="Neighbourhood or district" value={location} onChange={e => setLocation(e.target.value)} /></label>
      <div className={styles.pair}>
        <label>Plot size<input maxLength={60} placeholder="e.g. 18 × 24 m" value={size} onChange={e => setSize(e.target.value)} /></label>
        <label>Budget (USD)<input maxLength={60} placeholder="Amount or range" value={budget} onChange={e => setBudget(e.target.value)} /></label>
      </div>
      <a className={styles.action} href={whatsApp(lines.filter(Boolean).join("\n"))}>Enquire on WhatsApp</a>
    </div>
  );
}
