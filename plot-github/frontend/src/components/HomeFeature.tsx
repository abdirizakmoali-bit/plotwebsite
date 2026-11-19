"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ListingSearch } from "./ListingSearch";
import styles from "./HomeFeature.module.css";

const services = [
  {
    label: "Construction", title: "Build your home.",
    copy: "From foundations to handover, our team coordinates the people and work on your site.",
    action: "Discuss your build", href: "/contact/?service=Construction%20management",
    image: "/services/home-construction.webp", position: "57% 43%",
    alt: "The concrete frame and pitched roof of a house under construction",
    credit: "Tiago Chaves", source: "https://www.pexels.com/photo/modern-concrete-house-under-construction-40806174/",
  },
  {
    label: "Architectural design", title: "Design your home.",
    copy: "Shape the rooms, light and outdoor spaces around your family and your plot.",
    action: "Plan your design", href: "/contact/?service=Architectural%20design",
    image: "/services/courtyard-design.webp", position: "45% 50%",
    alt: "A sheltered walkway beside a modern home opens into a planted courtyard",
    credit: "Alexander F Ungerer", source: "https://www.pexels.com/photo/a-courtyard-with-a-gate-and-a-fence-21012299/",
  },
  {
    label: "Cost estimates", title: "Price your build.",
    copy: "Enter your floor area and compare finishes to get a first estimate for building in Hargeisa.",
    action: "Estimate your build cost", href: "/qiyaas/",
    image: "/services/cost-estimate.webp", position: "62% 58%",
    alt: "A tape measure and pen laid across a residential floor plan",
    credit: "Anete Lusina", source: "https://www.pexels.com/photo/instruments-prepared-for-measurements-in-house-4792479/",
  },
  {
    label: "Find land", title: "Find your plot.",
    copy: "Browse plots by area, or tell us where you want to build and how much space you need.",
    action: "Browse plots for sale", href: "/buy/?category=land",
    image: "/services/agabar-land.webp", position: "58% 50%",
    alt: "An aerial view of roads, homes and open land around Agabar in Somaliland",
    credit: "BahabarAdenArchives", source: "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Agabar_village,_Somaliland_20_April_2024.jpg",
    licence: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
  },
  {
    label: "Property development", title: "Develop your land.",
    copy: "Explore what fits your site, from a row of family homes to an apartment building.",
    action: "Discuss your development", href: "/contact/?service=Property%20development",
    image: "/services/apartment-development.webp", position: "61% 49%",
    alt: "Apartment buildings with balconies arranged around a shared courtyard",
    credit: "Mahmoud Zakariya", source: "https://www.pexels.com/photo/modern-apartment-complex-with-balconies-at-daytime-35707771/",
  },
];

const rotationInterval = 8000;

export function HomeFeature() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rotationControl = useRef<HTMLButtonElement>(null);
  const service = services[index];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!preference.matches);
    const stopIfReduced = () => { if (preference.matches) setPlaying(false); };
    preference.addEventListener("change", stopIfReduced);
    return () => preference.removeEventListener("change", stopIfReduced);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const nextPhoto = new Image();
    nextPhoto.src = services[(index + 1) % services.length].image;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % services.length), rotationInterval);
    const stopInBackground = () => { if (document.hidden) setPlaying(false); };
    stopInBackground();
    document.addEventListener("visibilitychange", stopInBackground);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", stopInBackground);
    };
  }, [index, playing]);

  return (
    <section className={styles.hero} aria-label="Explore PLOT services"
      onFocusCapture={(event) => { if (event.target !== rotationControl.current) setPlaying(false); }}>
      <img className={styles.photo} src={service.image} alt={service.alt}
        style={{ objectPosition: service.position }} fetchPriority={index === 0 ? "high" : "auto"} />
      <div className={styles.inner}>
        <div className={styles.copy} id="featured-service" aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <p className={styles.location}>Hargeisa, Somaliland</p>
          <h1>{service.title}</h1>
          <p className={styles.description}>{service.copy}</p>
          <Link className={styles.action} href={service.href} onPointerEnter={() => setPlaying(false)}>
            {service.action}<span aria-hidden="true">↗︎</span>
          </Link>
        </div>
        <div className={styles.searchArea}>
          <h2>Find property or land</h2>
          <ListingSearch />
        </div>
        <div className={styles.choices} role="group" aria-label="Choose a service">
          {services.map((item, i) => (
            <button key={item.label} type="button" aria-pressed={index === i} aria-controls="featured-service"
              onClick={() => { setPlaying(false); setIndex(i); }}>
              {item.label}
            </button>
          ))}
          <button ref={rotationControl} type="button" className={styles.rotation}
            aria-label={playing ? "Pause service rotation" : "Play service rotation"}
            onClick={() => setPlaying((value) => !value)}>
            <span className={playing ? styles.pauseIcon : styles.playIcon} aria-hidden="true" />
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <small className={styles.credit}>
          Photo · <a href={service.source} onPointerEnter={() => setPlaying(false)}>{service.credit}</a>
          {service.licence && <> · <a href={service.licence.url} onPointerEnter={() => setPlaying(false)}>{service.licence.name}</a> (cropped)</>}
        </small>
      </div>
    </section>
  );
}
