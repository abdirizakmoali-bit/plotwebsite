"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Finish, House } from "./measurements";
import s from "./estimate.module.css";

export type Inputs = { house: House; finish: Finish; ground: string; upper: string[]; wall: string; landscape: string; plot_width: string; plot_depth: string; landscape_edge: string };
function normalise(area: string) { return area.trim().replace(",", ".") || "0"; }

export default function DownloadEstimate({ inputs, ready }: { inputs: Inputs; ready: boolean }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<{url: string; snapshot: string} | null>(null);
  const [consent, setConsent] = useState(false);
  const snapshot = JSON.stringify([inputs, name, phone, email, consent]);
  useEffect(() => () => { if (file) URL.revokeObjectURL(file.url); }, [file]);
  const last = useRef({ payload: "", id: "" });
  const sending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || !ready) return;
    if (!name.trim() || phone.replace(/\D/g, "").length < 7) {
      setStatus("Fadlan hubi magacaaga iyo lambarka telefoonka."); return;
    }
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const { plot_width, plot_depth, landscape_edge, ...measurements } = inputs;
    const estimate = { ...measurements, ...(plot_width.trim() && plot_depth.trim() ? {
      plot_width:normalise(plot_width), plot_depth:normalise(plot_depth), landscape_edge,
    } : {}), ground:normalise(inputs.ground), upper:inputs.upper.map(normalise),
      wall:normalise(inputs.wall), landscape:normalise(inputs.landscape) };
    const query = new URLSearchParams(location.search);
    let campaign: Record<string,string> = {};
    try { campaign = JSON.parse(sessionStorage.getItem("plot-attribution") || "{}") || {}; } catch { /* Optional attribution. */ }
    const body = { full_name:name.trim(), phone:phone.trim(), email:email.trim(), consent:true, estimate,
      utm_source:(query.get("utm_source") || campaign.utm_source || "").slice(0,150),
      utm_medium:(query.get("utm_medium") || campaign.utm_medium || "").slice(0,150),
      utm_campaign:(query.get("utm_campaign") || campaign.utm_campaign || "").slice(0,150) };
    const serialised = JSON.stringify(body);
    if (last.current.payload !== serialised) last.current = {payload:serialised, id:crypto.randomUUID()};
    sending.current = true; setBusy(true); setStatus("Qiyaastaada waa la diyaarinayaa…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(base + "/api/estimate-download/", {
        method:"POST", headers:{"Content-Type":"application/json"}, signal:controller.signal, credentials:"omit",
        body:JSON.stringify({...body,submission_id:last.current.id}),
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) {
        if (response.status === 429) setStatus("Waxaad samaysay isku dayo badan. Fadlan mar kale isku day goor dambe.");
        else if (response.status === 400) setStatus("Fadlan dib u hubi magaca, iimaylka, telefoonka iyo cabbirrada guriga.");
        else setStatus("Soo dejintu ma suuragelin. Mar kale isku day, ama WhatsApp nagala soo xidhiidh.");
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = "PLOT-Qiyaasta-guriga.pdf";
      document.body.appendChild(link); link.click(); link.remove();
      setFile({url, snapshot});
      setStatus("");
    } catch { setStatus("Xidhiidhku wuu go’ay. Xogtaadii halkan ayey ku jirtaa, fadlan mar kale isku day."); }
    finally { clearTimeout(timeout); sending.current = false; setBusy(false); }
  }

  return <section id="soo-dejiso" className={s.download} aria-labelledby="personal-pdf">
    <h3 id="personal-pdf">Soo dejiso qiyaastaada (PDF)</h3>
    <form onSubmit={submit}>
      <p>Warbixintaadu waxay ka kooban tahay qiyaasta kharashka, sawirro iyo qorshaha dhulka. Ku qor magacaaga, telefoonkaaga iyo iimaylkaaga si aad u soo dejiso.</p>
      <fieldset disabled={busy}>
        <label>Magacaaga oo buuxa<input name="full_name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Lambarka telefoonka<input name="phone" autoComplete="tel" type="tel" required maxLength={60} value={phone} onChange={e=>setPhone(e.target.value)} /></label>
        <label>Iimaylkaaga<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label className={s.consent}><input name="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>Waxaan oggolahay in PLOT ay kaydiso xogtan oo ay igala soo xidhiidho qiyaastan. <a href="/privacy/" target="_blank" rel="noreferrer">Asturnaanta xogta</a></span></label>
        {!ready && <p className={s.formHelp}><a href="#xisaabi">Geli ama sax cabbirrada guriga</a> si aad u soo dejiso qiyaastaada.</p>}
        <button className={s.cta} disabled={!ready} type="submit">{busy ? "Waa la diyaarinayaa…" : "Soo dejiso PDF-ka"}</button>
      </fieldset>
      <div role="status" className={s.formStatus}>{status}{file && file.snapshot === snapshot && <div className={s.fileLinks}><strong>Qiyaastaada waa diyaar.</strong>
        <a href={file.url} download="PLOT-Qiyaasta-guriga.pdf">Mar kale soo dejiso PDF-ka</a>
        <a href={file.url} target="_blank" rel="noreferrer">Fur PDF-ka</a></div>}</div>
    </form>
  </section>;
}
