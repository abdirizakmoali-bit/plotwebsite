import type { Metadata } from "next";
import Calculator from "./Calculator";
import styles from "./estimate.module.css";

export const metadata: Metadata = {
  title: "Qiyaasta kharashka dhismaha guri | Hargeysa",
  description: "Xisaabi kharashka dhismaha gurigaaga Hargeysa. Isbarbardhig dhammaystirka caadiga ah iyo kan heerka sare.",
  alternates: { canonical: "/qiyaas/" },
};

export default function EstimatePage() {
  return <div lang="so" className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.intro}>
        <p>Hargeysa · Somaliland</p>
        <h1>Immisa ayuu ku kacayaa dhismaha gurigaaga?</h1>
        <p>Geli cabbirka gurigaaga, dooro heerka dhammaystirka, oo isla markiiba arag qiyaasta kharashka.</p>
      </div>
      <img src="/home.webp" alt="Naqshad guri ay diyaarisay PLOT" />
    </header>
    <Calculator />
  </div>;
}
