import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { services } from "@/lib/site";
import Link from "next/link";
export const metadata:Metadata={title:"Architecture, Engineering & Construction Services",description:"Explore architectural design, structural engineering, cost estimation, construction management and property development services in Hargeisa."};
export default function Services(){return <><PageHero eyebrow="Our expertise" title="The right expertise at the right stage." description="Whether you're developing an idea or preparing to build, PLOT helps define the technical work your project needs."/><section className="services section"><div className="shell">{services.map((s,i)=><article className="service-detail" key={s.name}><span>{String(i+1).padStart(2,"0")} / PLOT SERVICES</span><h2>{s.name}</h2><p>{s.description}</p></article>)}<div className="actions"><Link className="btn" href="/contact">ENQUIRE ABOUT A SERVICE ↗</Link></div></div></section></>}
