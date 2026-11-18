import Link from "next/link";
import { getPosts } from "@/lib/insights";

const features = [
  { image: "drawings", alt: "Four architectural elevations on a drawing sheet", title: "Design & engineering", text: "From room layouts to the drawings your builder needs.", link: "/services" },
  { image: "site", alt: "A two-storey home under construction", title: "Construction", text: "Plan the budget, coordinate the work and track progress on site.", link: "/process" },
  { image: "residences", alt: "Apartment balconies overlooking a landscaped path", title: "Property development", text: "Explore what your land could become, from a family home to apartments.", link: "/contact?service=Property%20development" }
];

export default function Home() {
  const latest = getPosts()[0];
  return <>
    <section className="cover"><img src="/studio/villa.webp" alt="A modern villa with a sheltered balcony and palm trees" fetchPriority="high"/>
      <div className="cover-copy"><p>Real estate & development · Hargeisa</p><h1>A home on<br/>your land.</h1>
        <Link href="/contact">Plan your project <span>↗</span></Link></div></section>
    <section className="shell disciplines"><h2>From land to keys.</h2><div className="tiles">{features.map(f => <Link key={f.title} href={f.link}>
      <img src={'/studio/' + f.image + '.webp'} alt={f.alt} loading="lazy"/><h3>{f.title} ↗</h3><p>{f.text}</p></Link>)}</div></section>
    {latest && <section className="home-journal shell"><Link href="/insights">Insights ↗</Link><div><h2><Link href={'/insights/' + latest.slug}>{latest.title}</Link></h2><p>{latest.summary}</p></div></section>}
  </>;
}
