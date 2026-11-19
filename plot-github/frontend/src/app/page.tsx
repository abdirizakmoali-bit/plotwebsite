import { HomeFeature } from "@/components/HomeFeature";
import Link from "next/link";
import styles from "./home-download.module.css";
import { getPosts } from "@/lib/insights";

const features = [
  { image: "drawings", alt: "Four architectural elevations on a drawing sheet", title: "Design & engineering", text: "From room layouts to the drawings your builder needs.", link: "/services" },
  { image: "site", alt: "A two-storey home under construction", title: "Construction", text: "Plan the budget, coordinate the work and track progress on site.", link: "/process" },
  { image: "residences", alt: "Apartment balconies overlooking a landscaped path", title: "Property development", text: "Explore what your land could become, from a family home to apartments.", link: "/contact?service=Property%20development" }
];

export default function Home() {
  const stories = getPosts().slice(0, 3);
  return <>
    <HomeFeature/>
    <section aria-labelledby="download-estimate-title" className="home-land">
      <div className="shell">
        <div><h2 id="download-estimate-title" className="feature-heading">Download your home estimate.</h2>
          <p>Planning a home in Hargeisa? Get a PDF with your build estimate and a diagram of your plot, boundary and landscaping. The illustrated sample guide is available to download straight away.</p>
        </div>
        <div className={styles.downloads}>
          <Link className={styles.primary} href="/qiyaas/#xisaabi">Get my estimate (PDF)</Link>
          <a className="text-action" href="/downloads/PLOT-Hagaha-Dhulka.pdf" download="PLOT-Hagaha-Dhulka.pdf">Download sample guide (PDF)</a>
        </div>
      </div>
    </section>
    <section className="shell disciplines"><h2>From land to keys.</h2><div className="tiles">{features.map(f => <Link key={f.title} href={f.link}>
      <img src={'/studio/' + f.image + '.webp'} alt={f.alt} loading="lazy"/><h3>{f.title} ↗</h3><p>{f.text}</p></Link>)}</div></section>
    <section className="home-land">
      <div className="shell">
        <div><h2 className="feature-heading">Plots for sale in Hargeisa.</h2>
          <p>Looking for land? Browse the listings or tell us the area, plot size and budget you have in mind.</p>
        </div>
        <Link className="text-action" href="/plots">Explore plots for sale</Link>
      </div>
    </section>
    <section className="home-portfolio"><div className="shell">
      <figure>
        <img src="/studio/pretoria-patio.webp" alt="A two-storey house opening onto a paved courtyard and pool" width={1100} height={825} loading="lazy"/>
        <figcaption>Residential reference, Pretoria · <a href="https://www.pexels.com/photo/photo-of-the-exterior-of-a-modern-house-with-a-swimming-pool-20702842/">Alexander F Ungerer</a></figcaption>
      </figure>
      <div><h2 className="feature-heading">Explore the portfolio.</h2>
        <p>See how a home comes together, from the approach to the front door to the rooms where your family spends the day.</p>
        <nav aria-label="Browse the portfolio"><Link className="text-action" href="/projects#studies">Design studies ↗</Link><Link className="text-action" href="/projects#ongoing">Ongoing projects ↗</Link><Link className="text-action" href="/projects#finished">Finished projects ↗</Link></nav>
      </div></div></section>
    <section className="shell journal-preview"><header><h2 className="feature-heading">Insights</h2><Link className="text-action" href="/insights">Browse all articles ↗</Link></header>
      <div className="story-grid">{stories.map(story => <article key={story.slug}><h3><Link href={'/insights/' + story.slug}>{story.title}</Link></h3><p>{story.summary}</p></article>)}</div>
    </section>
  </>;
}
