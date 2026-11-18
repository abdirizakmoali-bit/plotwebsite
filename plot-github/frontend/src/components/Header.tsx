"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/site";

export function Brand() {
  return <Link className="logotype" href="/" aria-label="PLOT home">
    <span className="brand-crop"><img src="/logo.webp" alt="PLOT Real Estate & Development" /></span>
  </Link>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return <div className="subnav-shell"><header className="nav shell">
    <Brand />
    <nav className={`navlinks${open ? " open" : ""}`} id="site-nav" aria-label="Main navigation">
      {navLinks.map(l => <Link key={l.href} className={path === l.href ? "active" : ""} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
      <a href="https://wa.me/252638339599" onClick={() => setOpen(false)}>WhatsApp</a>
      <a href="mailto:info@plotdevelopments.com" onClick={() => setOpen(false)}>Email</a>
    </nav>
    <Link className="navcta header-action" href="/contact">START A PROJECT ↗</Link>
    <button type="button" className="mobile-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
  </header></div>;
}
