"use client";

import { useState, type ReactNode } from "react";
import { buildingRate, dollars, estimate, parseArea, rates, type Finish, type House } from "./pricing";
import DownloadEstimate from "./DownloadEstimate";
import s from "./estimate.module.css";

function Area({ label, value, onChange, optional = false }: {
  label: string; value: string; onChange: (v: string) => void; optional?: boolean;
}) {
  const area = parseArea(value);
  const invalid = value !== "" && (area === null || (!optional && area === 0));
  return <label className={s.area}>
    <span>{label}</span>
    <span className={s.areaBox}>
      <input inputMode="decimal" type="text" value={value} placeholder={optional ? "0" : "120"}
        required={!optional} aria-invalid={invalid} onChange={event => onChange(event.target.value)} />
      <span aria-hidden="true">m²</span>
    </span>
    {invalid && <small>Geli cabbir sax ah, tusaale ahaan 24.5 m².</small>}
  </label>;
}

export default function Calculator({children}: {children: ReactNode}) {
  const [question, setQuestion] = useState("");
  const [house, setHouse] = useState<House>("bungalow");
  const [finish, setFinish] = useState<Finish>("standard");
  const [ground, setGround] = useState("");
  const [upper, setUpper] = useState<string[]>([]);
  const [wall, setWall] = useState("");
  const [landscape, setLandscape] = useState("");
  const amount = estimate(house, finish, ground, upper, wall, landscape);
  const standard = finish === "high" ? estimate(house, "standard", ground, upper, wall, landscape) : null;
  const houseName = house === "bungalow" ? "Guri baloog ah" : "Guri shub ah";
  const finishName = finish === "high" ? "Heer sare" : "Caadi";
  const lines: [string, number][] = amount ? [
    ["Dhismaha guriga", amount.building], ["Dayrka", amount.boundary], ["Habaynta daaradda", amount.landscaping],
    ["Korontada iyo tuubooyinka (10%)", amount.services], ["Haanta bulaacadda", rates.septic * 100],
  ] : [];
  const message = amount ? [
    "Salaan PLOT, waxaan jeclaan lahaa inaan injineer kala hadlo qiyaastan.",
    `Hargeysa · ${houseName} · Dhammaystir: ${finishName}`, `Dabaqa hoose: ${ground} m²`,
    ...(house === "framed" ? upper.map((v, i) => `Dabaqa ${i + 1}aad: ${v} m²`) : []),
    `Aagga darbiga dayrka: ${wall || "0"} m² · Daaradda: ${landscape || "0"} m²`,
    ...lines.map(([label, price]) => `${label}: ${dollars(price)}`), `Wadarta qiyaasta: ${dollars(amount.total)}`,
  ].join("\n") : "";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "252638339599";

  const questionLead = amount ? message : "Salaan PLOT, waxaan su’aal ka qabaa qiyaasta kharashka dhismaha guri ku yaalla Hargeysa.";
  const whatsapp = "https://wa.me/" + phone + "?text=" + encodeURIComponent(questionLead + (question.trim() ? "\n\nSu’aashayda: " + question.trim() : ""));
  return <>
    <header className={s.sectionIntro} id="xisaabi"><p className={s.kicker}>Xisaabiyaha dhismaha</p><h2>Qorshahaaga geli.</h2><p>Dooro nooca guriga, kadibna geli aagga dabaq kasta. Wadartu way isbeddelaysaa marka aad cabbir ama heer dhammaystir beddesho.</p></header>
    <div className={s.layout}>
    <section aria-label="Faahfaahinta guriga" className={s.controls}>
      <fieldset><legend>Nooca guriga</legend>
        <div className={s.choices}>
          <label><input type="radio" name="house" checked={house === "bungalow"} onChange={() => setHouse("bungalow")} /><span>Guri baloog ah<small>Hal dabaq, tiirar shub ah la’aan</small></span></label>
          <label><input type="radio" name="house" checked={house === "framed"} onChange={() => setHouse("framed")} /><span>Guri shub ah<small>Guri leh tiirar iyo dogobbo shub ah</small></span></label>
        </div>
      </fieldset>
      <fieldset><legend>Heerka dhammaystirka</legend>
        <div className={s.choices}>
          <label><input type="radio" name="finish" checked={finish === "standard"} onChange={() => setFinish("standard")} /><span>Caadi<small>Qiimaha aasaasiga ah</small></span></label>
          <label><input type="radio" name="finish" checked={finish === "high"} onChange={() => setFinish("high")} /><span>Heer sare<small>15% dheeraad ah qiimaha dhismaha</small></span></label>
        </div>
        <p>Labada heerba waxa ku jira saqafka, albaabbada, daaqadaha, marmarka sagxadda iyo rinjiga.</p>
      </fieldset>
      <fieldset><legend>Cabbirka dhismaha</legend>
        <Area label={`Dabaqa hoose · ${dollars(buildingRate(rates[house], finish) * 100)}/m²`} value={ground} onChange={setGround} />
        {house === "framed" && <>
          {upper.map((area, i) => <div key={i} className={s.floor}>
            <Area label={`Dabaqa ${i + 1}aad · ${dollars(buildingRate(rates.upper, finish) * 100)}/m²`} value={area}
              onChange={v => setUpper(values => values.map((old, n) => n === i ? v : old))} />
            <button type="button" className={s.textButton} aria-label={`Ka saar dabaqa ${i + 1}aad`} onClick={() => setUpper(values => values.filter((_, n) => n !== i))}>Ka saar</button>
          </div>)}
          <button type="button" disabled={upper.length >= 100} className={s.textButton} onClick={() => setUpper(values => [...values, ""])}>+ Ku dar dabaq kale</button>
        </>}
      </fieldset>
      <fieldset><legend>Dayrka iyo daaradda</legend>
        <p>Dayrka ka cabbir hal dhinac: dhererka guud ku dhufo joogga darbiga. Haddii aanad ku darin dayr ama habaynta daaradda, bannaanee cabbirkaas.</p>
        <div className={s.pair}>
          <Area label={`Darbiga dayrka · ${dollars(rates.boundary * 100)}/m²`} value={wall} onChange={setWall} optional />
          <Area label={`Habaynta daaradda · ${dollars(rates.landscaping * 100)}/m²`} value={landscape} onChange={setLandscape} optional />
        </div>
      </fieldset>
    </section>
    <aside className={s.result} aria-label="Natiijada qiyaasta">
      <h2>Qiyaasta gurigaaga</h2>
      <p className={s.finish}>{houseName} · {finish === "high" ? "Dhammaystir heer sare ah" : "Dhammaystir caadi ah"}</p>
      <div aria-live="polite" aria-atomic="true" className={s.live}>
        {amount ? <><span>Wadarta qiyaasta</span><strong>{dollars(amount.total)}</strong>
          {standard && <small>Dhammaystirka heerka sare wuxuu wadarta ku kordhiyey {dollars(amount.total - standard.total)}.</small>}</> :
          <><p>Geli cabbir sax ah dabaq kasta si aad u aragto wadarta.</p>
          {!ground && !upper.length && !wall && !landscape && <button type="button" className={s.example} onClick={() => {setHouse("bungalow"); setFinish("standard"); setGround("120"); setWall("100"); setLandscape("50");}}>Tijaabi tusaale guri 120 m² ah</button>}</>}
      </div>
      {amount && <>
        <div className={s.composition} aria-hidden="true">{lines.map(([label, value],i) => <span key={label} className={s["shade"+i]} style={{width:(value / amount.total * 100) + "%"}}/>)}</div>
        <dl>{lines.map(([label, price],i) => <div key={label}><dt><i className={s["shade"+i]} aria-hidden="true"/>{label}</dt><dd>{dollars(price)}</dd></div>)}</dl>
        <DownloadEstimate inputs={{house,finish,ground,upper:house === "framed" ? upper : [],wall,landscape}} />
        <a className={s.askLink} href={whatsapp} target="_blank" rel="noopener noreferrer">Qiyaastan WhatsApp nagala hadal</a>
      </>}
      <p className={s.note}>Qiimaha kama dambaysta ahi wuxuu ku xiran yahay naqshadda, goobta iyo agabka aad doorato.</p>
    </aside>
  </div>
  {children}
  <section className={s.question} aria-labelledby="question-title">
    <div><p className={s.eyebrow}>La hadal injineerka PLOT</p><h2 id="question-title">Faahfaahin ma u baahan tahay?</h2>
      <p>Haddii aad rabto sharaxaad ku saabsan qiyaasta ama aad qabto su’aal kale, si toos ah WhatsApp noogala hadal. Haddii aad qiyaas samaysay, faahfaahinteedu waxay la soconaysaa farriintaada.</p></div>
    <div><label htmlFor="qiyaas-question">Maxaad jeclaan lahayd inaad ogaato? <small>(Ikhtiyaari)</small></label>
      <textarea id="qiyaas-question" rows={3} maxLength={600} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Tusaale ahaan, maxaa ku jira kharashka dhammaystirka?"/>
      <a className={s.wa} href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp noogu soo qor</a></div>
  </section>
  </>;
}
