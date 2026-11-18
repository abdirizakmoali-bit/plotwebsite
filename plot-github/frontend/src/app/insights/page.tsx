import Link from "next/link";
import { getPosts } from "@/lib/insights";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Insights", description: "Notes from PLOT on planning, costing and building in Somaliland." };

export default function Insights() {
  return <><PageHero eyebrow="PLOT journal" title="Insights" description="Field notes on planning, costing and building in Somaliland."/>
    <section className="shell journal">{getPosts().map(post => <article key={post.slug}>
      <time dateTime={post.date}>{post.date}</time><div><h2><Link href={'/insights/' + post.slug}>{post.title}</Link></h2><p>{post.summary}</p></div>
      <Link aria-label={'Read ' + post.title} href={'/insights/' + post.slug}>Read article ↗</Link></article>)}</section></>;
}
