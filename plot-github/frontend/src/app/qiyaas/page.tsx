import type { Metadata } from "next";
import Calculator from "./Calculator";
import { buildingRate, dollars, rates } from "./pricing";
import s from "./estimate.module.css";

export const metadata: Metadata = {
  title: "Qiyaasta kharashka dhismaha guri | Hargeysa",
  description: "Xisaabi kharashka gurigaaga Hargeysa, isbarbardhig heerarka dhammaystirka oo soo dejiso qiyaastaada oo PDF ah.",
  alternates: { canonical: "/qiyaas/" },
};

const priceRows = [
  ["Guri baloog ah", rates.bungalow], ["Dabaqa hoose ee guri shub ah", rates.framed], ["Dabaqyada sare ee guri shub ah", rates.upper],
] as const;

function Guide() {
  return <section id="habka" className={s.guide} aria-labelledby="guide-title">
    <div className={s.rateGuide}>
      <div><p className={s.kicker}>Qiimaha halkii m²</p><h2 id="guide-title">Sidee loo xisaabiyaa kharashka?</h2>
        <p>Qiimuhu wuxuu ka bilaabmaa baaxadda dabaq kasta. Dhammaystirka heerka sare ahi wuxuu qiimaha dhismaha ku kordhiyaa 15%.</p>
        <div className={s.chartKey}><span>Caadi</span><span>Korodhka heerka sare</span></div>
      </div>
      <div className={s.rateRows}>{priceRows.map(([label, base]) => {
        const high = buildingRate(base,"high");
        return <div key={label}><div className={s.rateCaption}><span>{label}</span><span>{dollars(base * 100)} / {dollars(high * 100)}</span></div>
          <div className={s.rateTrack} aria-hidden="true"><span style={{width: (base / 460 * 100) + "%"}}/><i style={{width: ((high-base) / 460 * 100) + "%"}}/></div>
        </div>;
      })}</div>
    </div>
    <div className={s.finishGuide}>
      <img src="/kitchen.webp" loading="lazy" alt="Jiko leh armaajooyin, sagxad marmar ah iyo meel cuntada lagu diyaariyo"/>
      <div><p className={s.kicker}>Waxa qiimaha ku jira</p><h2>Saamiga qayb kasta faham.</h2>
        <details open><summary>Dhismaha iyo dhammaystirka</summary><p>Saqafka, albaabbada, daaqadaha, marmarka sagxadda iyo rinjigu waxay ku jiraan labada heer. Guriga shubka ah, dabaqa hoose iyo dabaqyada sare mid walba qiime u gaar ah ayuu leeyahay.</p></details>
        <details><summary>Dayrka iyo habaynta daaradda</summary><p>Hal dhinac ka cabbir darbiga dayrka. Dhererka ku dhufo joogga, dabadeed ku xisaabi $150/m². Meesha daaradda ee aad rabto inaad habayso waxay ku kacaysaa $20/m².</p></details>
        <details><summary>Korontada, tuubooyinka iyo haanta</summary><p>Korontada iyo tuubooyinku waa 10% wadarta dhismaha, dayrka iyo habaynta daaradda. Haanta bulaacadda waxaa hal mar lagu daraa $3,500.</p></details>
      </div>
    </div>
  </section>;
}

export default function EstimatePage() {
  return <div lang="so" className={s.page}>
    <header className={s.hero}>
      <img className={s.heroPhoto} src="/living.webp" fetchPriority="high" alt="Qol fadhiga oo leh daaqado dhaadheer, alaab casri ah iyo iftiin dabiici ah"/>
      <div className={s.intro}>
        <p className={s.eyebrow}>Hargeysa, Somaliland</p>
        <h1>Immisa ayuu ku kacayaa <em>gurigaaga?</em></h1>
        <p>Ka bilow cabbirka guriga aad ku riyoonayso. Isbarbardhig dhammaystirka, arag halka lacagtaadu ku baxayso, kadibna soo dejiso qiyaastaada.</p>
        <nav aria-label="Qaybaha qiyaasta"><a href="#xisaabi">Xisaabi kharashka</a><a href="#habka">Eeg sida loo xisaabiyo</a></nav>
      </div>
    </header>
    <Calculator><Guide/></Calculator>
  </div>;
}
