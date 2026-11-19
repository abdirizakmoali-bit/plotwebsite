"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const groups = {
  Services: [
    ["Explore services", "/services"],
    ["Our process", "/process"],
    ["Request a cost estimate", "/contact?service=Cost%20estimation%20%2F%20BOQ"]
  ],
  Projects: [
    ["Project portfolio", "/projects"],
    ["Ongoing projects", "/projects#ongoing"],
    ["Finished projects", "/projects#finished"],
    ["Design studies", "/projects#studies"]
  ],
  "Get in touch": [
    ["Project enquiry", "/contact"],
    ["WhatsApp", "https://wa.me/252638339599"],
    ["Email PLOT", "mailto:info@plotdevelopments.com"]
  ]
} as const;

type Group = keyof typeof groups;

export function Header() {
  const path = usePathname();
  return <Navigation key={path} path={path} />;
}

function Navigation({ path }: { path: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const groupTrigger = useRef<HTMLButtonElement | null>(null);
  const current = path.replace(/\/$/, "") || "/";
  const home = current === "/";
  const close = () => { setGroup(null); setMobileOpen(false); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) close();
    };
    const breakpoint = window.matchMedia("(max-width: 900px)");
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", outside);
    breakpoint.addEventListener("change", close);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", outside);
      breakpoint.removeEventListener("change", close);
    };
  }, []);

  function dropdown(label: Group, id: string) {
    const open = group === label;
    return <div className={styles.group}>
      <button type="button" className={label === "Get in touch" ? styles.contact : styles.trigger}
        aria-expanded={open} aria-controls={id}
        onClick={event => { groupTrigger.current = event.currentTarget; setGroup(open ? null : label); }}>
        {label}<span className={styles.chevron} aria-hidden="true" />
      </button>
      <div id={id} hidden={!open} className={styles.panel}>
        {groups[label].map(([text, href]) => href.startsWith("/") ?
          <Link key={href} href={href} aria-current={current === href ? "page" : undefined} onClick={close}>{text}</Link> :
          <a key={href} href={href} onClick={close}>{text}</a>)}
      </div>
    </div>;
  }

  return <header ref={header} className={styles.header} data-home={home} data-clear={home && !scrolled && !mobileOpen}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}
    onKeyDown={event => {
      if (event.key !== "Escape") return;
      if (group) { setGroup(null); groupTrigger.current?.focus(); }
      else if (mobileOpen) { close(); mobileToggle.current?.focus(); }
    }}>
    <div className={styles.bar}>
      <Link href="/" aria-label="PLOT home" onClick={close} className={styles.brand}><img src="/footer-logo.webp" width={760} height={259} alt="PLOT Real Estate & Development" /></Link>
      <button ref={mobileToggle} type="button" className={styles.toggle} aria-expanded={mobileOpen} aria-controls="site-nav"
        onClick={() => { setMobileOpen(!mobileOpen); setGroup(null); }}>{mobileOpen ? "Close" : "Menu"}<span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span></button>
      <nav id="site-nav" aria-label="Main navigation" className={styles.nav} data-open={mobileOpen}>
        {dropdown("Services", "nav-services")}{dropdown("Projects", "nav-projects")}
        <Link href="/plots" aria-current={current === "/plots" ? "page" : undefined} onClick={close}>Plots for sale</Link>
        <Link href="/insights" aria-current={current === "/insights" ? "page" : undefined} onClick={close}>Insights</Link><Link href="/about" aria-current={current === "/about" ? "page" : undefined} onClick={close}>About</Link>
        {dropdown("Get in touch", "nav-contact")}
      </nav>
    </div>
  </header>;
}
