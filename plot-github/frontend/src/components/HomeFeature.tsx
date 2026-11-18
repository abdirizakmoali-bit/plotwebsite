"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./HomeFeature.module.css";

const features = [
  { label: "Build a home", title: "A home on your land.", image: "/home.webp", alt: "Residential design study with a landscaped courtyard and sheltered entrance",
    copy: "Design, engineering and construction for the way your family lives in Hargeisa.", action: "Plan your home", href: "/contact?service=Architectural%20design" },
  { label: "Estimate costs", title: "What will it cost to build?", image: "/studio/site.webp", alt: "Residential building under construction",
    copy: "Bring your drawings. Explore quantities, finishes and allowances before you compare builders.", action: "Request a cost estimate", href: "/contact?service=Cost%20estimation%20%2F%20BOQ" },
  { label: "Develop land", title: "What could your land become?", image: "/studio/residences.webp", alt: "Residential buildings overlooking a landscaped path",
    copy: "Explore housing options for your plot, from its first layout to a feasibility brief.", action: "Discuss your land", href: "/contact?service=Property%20development" }
];

export function HomeFeature() {
  const [index, setIndex] = useState(0);
  const feature = features[index];
  return <section className={styles.hero} aria-label="Explore PLOT services">
    <img key={feature.image} src={feature.image} className={styles.photo} alt={feature.alt} fetchPriority="high" />
    <div className={styles.inner}>
      <div className={styles.copy} aria-live="polite" aria-atomic="true">
        <p className={styles.location}>Hargeisa, Somaliland</p>
        <h1>{feature.title}</h1><p className={styles.description}>{feature.copy}</p>
        <Link className={styles.action} href={feature.href}>{feature.action}<span aria-hidden="true">↗︎</span></Link>
      </div>
      <div className={styles.choices} role="group" aria-label="Choose your project goal">
        {features.map((item,i) => <button key={item.label} onClick={() => setIndex(i)} type="button" aria-pressed={index === i}>{item.label}</button>)}
      </div>
    </div>
  </section>;
}
