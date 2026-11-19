"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Finish, House } from "./pricing";
import s from "./estimate.module.css";

export type Inputs = { house: House; finish: Finish; ground: string; upper: string[]; wall: string; landscape: string };
function normalise(area: string) { return area.trim().replace(",", ".") || "0"; }

export default function DownloadEstimate({ inputs }: { inputs: Inputs }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const last = useRef({ payload: "", id: "" });
  const sending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!name.trim() || phone.replace(/\D/g, "").length < 7) {
      setStatus("Fadlan hubi magacaaga iyo lambarka telefoonka."); return;
    }
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const estimate = { ...inputs, ground:normalise(inputs.ground), upper:inputs.upper.map(normalise),
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
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("Qiyaastaada waa diyaar. Ka eeg PDF-ka faylasha aad soo dejisay.");
    } catch { setStatus("Xidhiidhku wuu go’ay. Xogtaadii halkan ayey ku jirtaa, fadlan mar kale isku day."); }
    finally { clearTimeout(timeout); sending.current = false; setBusy(false); }
  }

  return <details className={s.download}>
    <summary>Soo dejiso qiyaastaada <span>PDF</span></summary>
    <form onSubmit={submit}>
      <p>Hel warbixin kuu gaar ah oo ay ku qoran yihiin cabbirrada, kharashka qayb kasta iyo wadarta.</p>
      <fieldset disabled={busy}>
        <label>Magacaaga oo buuxa<input name="full_name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Lambarka telefoonka<input name="phone" autoComplete="tel" type="tel" required maxLength={60} value={phone} onChange={e=>setPhone(e.target.value)} /></label>
        <label>Iimaylkaaga<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label className={s.consent}><input name="consent" type="checkbox" required/><span>Waxaan oggolahay in PLOT ay kaydiso xogtan oo ay igala soo xidhiidho qiyaastan. <a href="/privacy/" target="_blank" rel="noreferrer">Asturnaanta xogta</a></span></label>
        <button className={s.cta} type="submit">{busy ? "Waa la diyaarinayaa…" : "Soo dejiso PDF-ka"}</button>
      </fieldset>
      <div role="status" className={s.formStatus}>{status}</div>
    </form>
  </details>;
}
