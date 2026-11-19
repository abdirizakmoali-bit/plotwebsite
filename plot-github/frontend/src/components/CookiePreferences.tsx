"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cookieChoice, refreshCampaign, saveCookieChoice } from "@/lib/campaign";
import styles from "./CookiePreferences.module.css";

const english = {
  settings: "Cookie settings", title: "Your cookie choices",
  body: "May we remember which campaign link brought you here? If you request an estimate or send an enquiry, this helps PLOT see which campaigns bring enquiries. You can use every feature either way.",
  allow: "Allow measurement", decline: "Decline measurement", privacy: "Privacy notice",
};
const somali = {
  settings: "Dejinta cookies-ka", title: "Doorashada cookies-ka",
  body: "Ma noo oggolaanaysaa inaan xasuusanno xiriirkii ololaha ee aad halkan ka soo gashay? Haddii aad qiyaas codsato ama aad nala soo xiriirto, waxaan ogaan karnaa ololaha aad naga soo heshay. Labada doorashoba waxaad ku soo dejisan kartaa qiyaastaada.",
  allow: "Oggolow cabbirka ololaha", decline: "Diid cabbirka ololaha", privacy: "Asturnaanta xogta",
};

export function CookiePreferences() {
  const pathname = usePathname();
  const isSomali = /^\/qiyaas(?:\/|$)/.test(pathname);
  const copy = isSomali ? somali : english;
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<ReturnType<typeof cookieChoice>>(null);
  const settings = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const manuallyOpened = useRef(false);
  const dismissed = useRef(false);

  useEffect(() => {
    const sync = () => {
      refreshCampaign();
      const saved = cookieChoice();
      setChoice(saved);
      if (!manuallyOpened.current) setOpen(!saved && !dismissed.current);
    };
    sync();
    const whenVisible = () => { if (!document.hidden) sync(); };
    window.addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", whenVisible);
    return () => {
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("visibilitychange", whenVisible);
    };
  }, [pathname]);

  useEffect(() => {
    if (open && manuallyOpened.current) title.current?.focus();
  }, [open]);

  function choose(value: "allow" | "decline") {
    saveCookieChoice(value);
    refreshCampaign();
    setChoice(cookieChoice());
    dismissed.current = true;
    setOpen(false);
    if (manuallyOpened.current) settings.current?.focus();
    manuallyOpened.current = false;
  }

  return <>
    <button ref={settings} className={styles.settings} type="button" lang={isSomali ? "so" : "en"}
      aria-expanded={open} onClick={() => { manuallyOpened.current = true; setOpen(true); if (open) title.current?.focus(); }}>
      {copy.settings}
    </button>
    {open && createPortal(<section className={styles.panel} lang={isSomali ? "so" : "en"} aria-labelledby="cookie-title">
      <h2 ref={title} tabIndex={-1} id="cookie-title">{copy.title}</h2>
      <p>{copy.body} <Link href="/privacy/#cookies">{copy.privacy}</Link></p>
      <div className={styles.actions}>
        <button type="button" aria-pressed={choice === "allow"} onClick={() => choose("allow")}>{copy.allow}</button>
        <button type="button" aria-pressed={choice === "decline"} onClick={() => choose("decline")}>{copy.decline}</button>
      </div>
    </section>, document.body)}
  </>;
}
