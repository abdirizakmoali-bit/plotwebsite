"use client";

import { useState } from "react";
import { whatsApp } from "@/lib/listings";
import styles from "./plots.module.css";

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
