import type { Metadata } from "next";
import { SaleListings } from "@/components/SaleListings";
import { PlotSearchBrief } from "./PlotCatalogue";
import styles from "./plots.module.css";

export const metadata: Metadata = {
  title: "Plots for sale in Hargeisa",
  description: "Explore land for sale in Hargeisa, ask about a plot or arrange a site visit with PLOT.",
  alternates: { canonical: "/plots/" },
};

export default function PlotsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className="shell">
          <p className={styles.place}>Hargeisa, Somaliland</p>
          <h1>Plots for sale.</h1>
          <p>Explore land for your next home or development. Ask about a listing or tell us where you’d like to buy.</p>
        </div>
      </header>
      <div className={`shell ${styles.layout}`}>
        <section aria-labelledby="listings-title">
          <h2 className={styles.heading} id="listings-title">Available plots</h2>
          <SaleListings category="land" landPage />
        </section>
        <aside className={styles.brief} aria-labelledby="search-title">
          <h2 id="search-title" className={styles.heading}>Find me a plot</h2>
          <p>Share what you’re looking for with the PLOT team.</p>
          <PlotSearchBrief />
        </aside>
      </div>
    </div>
  );
}
