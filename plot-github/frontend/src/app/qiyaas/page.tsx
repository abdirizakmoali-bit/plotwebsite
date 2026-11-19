import type { Metadata } from "next";
import Calculator from "./Calculator";
import s from "./estimate.module.css";

export const metadata: Metadata = {
  title: "Qiyaasta kharashka dhismaha guri | Hargeysa",
  description: "Xisaabi kharashka gurigaaga Hargeysa, isbarbardhig heerarka dhammaystirka oo soo dejiso qiyaastaada oo PDF ah.",
  alternates: { canonical: "/qiyaas/" },
};

function Guide() {
  return <section id="habka" className={s.guide} aria-labelledby="guide-title">
    <div className={s.rateGuide}>
      <div><p className={s.kicker}>Cabbirrada aad u baahan tahay</p><h2 id="guide-title">Sidee loo diyaariyaa qiyaasta?</h2>
        <p>Ka soo qaado cabbirrada naqshadda gurigaaga. Tilmaamahan ayaa kaa caawinaya inaad kala saarto dhismaha, dayrka iyo daaradda.</p>
      </div>
      <dl className={s.measureGuide}>
        <div><dt>Dabaq kasta</dt><dd>Geli bedka dhismaha dabaq kasta oo mitir laba jibbaaran ah.</dd></div>
        <div><dt>Dayrka</dt><dd>Isku dhufo dhererka iyo joogga darbiga. Hal dhinac ka cabbir.</dd></div>
        <div><dt>Daaradda</dt><dd>Geli bedka bannaanka aad rabto inaad habayso.</dd></div>
      </dl>
    </div>
    <div className={s.finishGuide}>
      <img src="/kitchen.webp" loading="lazy" alt="Jiko leh armaajooyin, sagxad marmar ah iyo meel cuntada lagu diyaariyo"/>
      <div><p className={s.kicker}>Waxa qiimaha ku jira</p><h2>Saamiga qayb kasta faham.</h2>
        <details open><summary>Dhismaha iyo dhammaystirka</summary><p>Saqafka, albaabbada, daaqadaha, marmarka sagxadda iyo rinjigu waxay ku jiraan labada heer. Guriga shubka ah, dabaqa hoose iyo dabaqyada sare mid walba qiime u gaar ah ayuu leeyahay.</p></details>
        <details><summary>Dayrka iyo habaynta daaradda</summary><p>Hal dhinac ka cabbir darbiga dayrka. Dhererka ku dhufo joogga. Daaradda u geli keliya bedka bannaanka aad rabto inaad habayso.</p></details>
        <details><summary>Korontada, tuubooyinka iyo haanta</summary><p>Qiyaastaada waxaa ku jira shaqada korontada, tuubooyinka iyo hal haan oo bulaacadeed. Mid kasta waxaad ka arki kartaa warbixintaada.</p></details>
      </div>
    </div>
  </section>;
}

export default function EstimatePage() {
  return <div lang="so" className={s.page}>
    <header className={s.hero}>
      <img className={s.heroPhoto} src="/studio/site.webp" fetchPriority="high" alt="Guri laba dabaq ah oo dhismihiisu socdo, hortiisana yaallaan agab dhisme"/>
      <div className={s.intro}>
        <p className={s.eyebrow}>Hargeysa, Somaliland</p>
        <h1>Immisa ayuu ku kacayaa <em>gurigaaga?</em></h1>
        <p>Geli cabbirrada gurigaaga, dooro heerka dhammaystirka, kadibna soo dejiso PDF kuu gaar ah oo faahfaahinaya kharashka dhismaha.</p>
        <nav aria-label="Qaybaha qiyaasta"><a href="#xisaabi">Bilow qiyaastaada</a><a href="#habka">Eeg sida loo cabbiro</a></nav>
      </div>
    </header>
    <Calculator><Guide/></Calculator>
  </div>;
}
