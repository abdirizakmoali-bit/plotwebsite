"use client";

import { useState, type ReactNode } from "react";
import { parseArea, type Finish, type House } from "./measurements";
import DownloadEstimate from "./DownloadEstimate";
import s from "./estimate.module.css";

function Area({ label, value, onChange, optional = false, unit = "m²" }: {
  label: string; value: string; onChange: (v: string) => void; optional?: boolean; unit?: "m" | "m²";
}) {
  const area = parseArea(value);
  const invalid = value !== "" && (area === null || (!optional && area === 0));
  return <label className={s.area}>
    <span>{label}</span>
    <span className={s.areaBox}>
      <input inputMode="decimal" type="text" value={value} placeholder={unit === "m" ? "—" : optional ? "0" : "120"}
        required={!optional} aria-invalid={invalid} onChange={event => onChange(event.target.value)} />
      <span>{unit}</span>
    </span>
    {invalid && <small>Geli cabbir sax ah, tusaale ahaan 24.5 {unit}.</small>}
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
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [edge, setEdge] = useState("back");
  const w = parseArea(width), d = parseArea(depth);
  const hasPlot = Boolean(width.trim() || depth.trim());
  const dimensionsValid = w !== null && d !== null && w > 0 && d > 0;
  const exceedsPlot = dimensionsValid && Math.round((parseArea(landscape) ?? 0) * 100) * 100 > Math.round(w * 100) * Math.round(d * 100);
  const plotValid = !hasPlot || (dimensionsValid && !exceedsPlot);
  const floorInputs = house === "framed" ? [ground, ...upper] : [ground];
  const floorAreas = floorInputs.map(parseArea);
  const ready = plotValid && floorAreas.every(area => area !== null && area > 0)
    && [wall, landscape].every(value => value.trim() === "" || parseArea(value) !== null);
  const floorTotal = floorAreas.reduce<number>((sum, area) => sum + (area ?? 0), 0);
  const houseName = house === "bungalow" ? "Guri baloog ah" : "Guri shub ah";
  const finishName = finish === "high" ? "Heer sare" : "Caadi";
  const message = [
    "Salaan PLOT, waxaan jeclaan lahaa inaan injineer kala hadlo qorshahan.",
    `Hargeysa · ${houseName} · Dhammaystir: ${finishName}`, `Dabaqa hoose: ${ground} m²`,
    ...(house === "framed" ? upper.map((v, i) => `Dabaqa ${i + 1}aad: ${v} m²`) : []),
    `Aagga darbiga dayrka: ${wall || "0"} m² · Daaradda: ${landscape || "0"} m²`,
    ...(hasPlot && plotValid ? [`Dhulka: ${width} × ${depth} m`] : []),
  ].join("\n");
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "252638339599";

  const questionLead = ready ? message : "Salaan PLOT, waxaan su’aal ka qabaa qiyaasta kharashka dhismaha guri ku yaalla Hargeysa.";
  const whatsapp = "https://wa.me/" + phone + "?text=" + encodeURIComponent(questionLead + (question.trim() ? "\n\nSu’aashayda: " + question.trim() : ""));
  return <>
    <header className={s.sectionIntro} id="xisaabi"><p className={s.kicker}>Xisaabiyaha dhismaha</p><h2>Qorshahaaga geli.</h2><p>Dooro nooca guriga, kadibna geli aagga dabaq kasta. Markaad xogtaada geliso, waxaad soo dejisan kartaa PDF ay ku qoran yihiin kharashyada gurigaaga.</p></header>
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
          <label><input type="radio" name="finish" checked={finish === "standard"} onChange={() => setFinish("standard")} /><span>Caadi<small>Dhammaystirka caadiga ah</small></span></label>
          <label><input type="radio" name="finish" checked={finish === "high"} onChange={() => setFinish("high")} /><span>Heer sare<small>Agab iyo dhammaystir heer sare ah</small></span></label>
        </div>
        <p>Labada heerba waxa ku jira saqafka, albaabbada, daaqadaha, marmarka sagxadda iyo rinjiga.</p>
      </fieldset>
      <fieldset><legend>Cabbirka dhismaha</legend>
        <Area label="Dabaqa hoose" value={ground} onChange={setGround} />
        {house === "framed" && <>
          {upper.map((area, i) => <div key={i} className={s.floor}>
            <Area label={`Dabaqa ${i + 1}aad`} value={area}
              onChange={v => setUpper(values => values.map((old, n) => n === i ? v : old))} />
            <button type="button" className={s.textButton} aria-label={`Ka saar dabaqa ${i + 1}aad`} onClick={() => setUpper(values => values.filter((_, n) => n !== i))}>Ka saar</button>
          </div>)}
          <button type="button" disabled={upper.length >= 100} className={s.textButton} onClick={() => setUpper(values => [...values, ""])}>+ Ku dar dabaq kale</button>
        </>}
      </fieldset>
      <fieldset><legend>Qorshaha dhulka <small>(ikhtiyaari)</small></legend>
        <p>Haddii dhulkaagu leydi yahay, geli ballaca iyo dhererka si PDF-ku u muujiyo xadka dhulkaaga iyo daaradda. Haddii aad bannaanto labadaba, PDF-ku wuxuu ku tusayaa qorshe tusaale ah.</p>
        <div className={s.pair}>
          <Area label="Ballaca dhulka" unit="m" value={width} onChange={setWidth} optional />
          <Area label="Dhererka dhulka" unit="m" value={depth} onChange={setDepth} optional />
        </div>
        {hasPlot && !dimensionsValid && <p role="status">Geli ballac iyo dherer labaduba ka weyn eber.</p>}
      </fieldset>
      <fieldset><legend>Dayrka iyo daaradda</legend>
        <p>Dayrka ka cabbir hal dhinac: dhererka guud ku dhufo joogga darbiga. Haddii aanad ku darin dayr ama habaynta daaradda, bannaanee cabbirkaas.</p>
        <div className={s.pair}>
          <Area label="Darbiga dayrka" value={wall} onChange={setWall} optional />
          <Area label="Habaynta daaradda" value={landscape} onChange={setLandscape} optional />
        </div>
        {exceedsPlot && <p role="status">Bedka daaraddu kama badnaan karo bedka dhulka.</p>}
        {hasPlot && (parseArea(landscape) ?? 0) > 0 && <label className={s.edge}>Dhinaca la habaynayo
          <select value={edge} onChange={e => setEdge(e.target.value)}><option value="back">Dhabarka</option><option value="front">Hore</option><option value="left">Bidix</option><option value="right">Midig</option></select>
        </label>}
      </fieldset>
    </section>
    <aside className={s.result} aria-label="Natiijada qiyaasta">
      <h2>Qiyaasta gurigaaga</h2>
      <p className={s.finish}>{houseName} · {finish === "high" ? "Dhammaystir heer sare ah" : "Dhammaystir caadi ah"}</p>
      <div aria-live="polite" aria-atomic="true" className={s.live}>
        {ready ? <><span>Wadarta bedka dabaqyada</span>
          <strong>{floorTotal.toLocaleString("en-US", {maximumFractionDigits: 2})} m²</strong>
          <p>Qiyaasta kharashka iyo faahfaahinta qayb kasta waxaad ka helaysaa PDF-kaaga.</p></> :
          <><p>Geli cabbirka dabaq kasta si aad u codsato qiyaastaada.</p>
          {!ground && !upper.length && !wall && !landscape && <button type="button" className={s.example} onClick={() => {setHouse("bungalow"); setFinish("standard"); setGround("120"); setWall("100"); setLandscape("50"); setWidth("20"); setDepth("30"); setEdge("back");}}>Tijaabi tusaale guri 120 m² ah</button>}</>}
      </div>
      <DownloadEstimate ready={ready} inputs={{house,finish,ground,upper:house === "framed" ? upper : [],wall,landscape,plot_width:width,plot_depth:depth,landscape_edge:edge}} />
      {ready && <a className={s.askLink} href={whatsapp} target="_blank" rel="noopener noreferrer">Qiyaastan WhatsApp nagala hadal</a>}
      <p className={s.note}>Qiimaha kama dambaysta ahi wuxuu ku xiran yahay naqshadda, goobta iyo agabka aad doorato.</p>
    </aside>
  </div>
  {children}
  <section className={s.question} aria-labelledby="question-title">
    <div><p className={s.eyebrow}>La hadal injineerka PLOT</p><h2 id="question-title">Faahfaahin ma u baahan tahay?</h2>
      <p>Haddii aad rabto sharaxaad ku saabsan qiyaasta ama aad qabto su’aal kale, si toos ah WhatsApp noogala hadal. Haddii aad cabbirrada gelisay, waxay la soconayaan farriintaada.</p></div>
    <div><label htmlFor="qiyaas-question">Maxaad jeclaan lahayd inaad ogaato? <small>(Ikhtiyaari)</small></label>
      <textarea id="qiyaas-question" rows={3} maxLength={600} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Tusaale ahaan, maxaa ku jira kharashka dhammaystirka?"/>
      <a className={s.wa} href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp noogu soo qor</a></div>
  </section>
  </>;
}
