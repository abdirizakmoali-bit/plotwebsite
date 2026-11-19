"use client";

import { useState } from "react";
import { buildingRate, dollars, estimate, parseArea, rates, type Finish, type House } from "./pricing";
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

export default function Calculator() {
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

  return <div className={s.layout}>
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
          <button type="button" className={s.textButton} onClick={() => setUpper(values => [...values, ""])}>+ Ku dar dabaq kale</button>
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
          <p>Geli cabbir sax ah dabaq kasta si aad u aragto wadarta.</p>}
      </div>
      {amount && <>
        <dl>{lines.map(([label, price]) => <div key={label}><dt>{label}</dt><dd>{dollars(price)}</dd></div>)}</dl>
        <a className={s.cta} href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}>Injineerka PLOT kala hadal WhatsApp</a>
      </>}
      <p className={s.note}>Qiimaha kama dambaysta ahi wuxuu ku xiran yahay naqshadda, goobta iyo agabka aad doorato.</p>
    </aside>
  </div>;
}
