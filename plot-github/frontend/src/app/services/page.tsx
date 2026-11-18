import type { Metadata } from "next";
import Link from "next/link";
import { ServiceFinder } from "@/components/LeadExperience";
import { PageHero } from "@/components/PageHero";
import { services } from "@/lib/site";

export const metadata: Metadata = { title: "Architecture, engineering & construction services", description: "See what to bring and what to ask for when commissioning design, engineering, estimating or construction management in Hargeisa." };

export default function Services() {
  return <>
    <PageHero eyebrow="Our expertise" title="Choose the support your project needs." description="Start with one discipline or ask us to coordinate several. Your proposal sets out the drawings, reviews and site visits included in your commission."/>
    <section className="services section"><div className="shell scope-list">
      {services.map((service) => <article key={service.name}>
        <div><h2>{service.name}</h2><p>{service.description}</p></div>
        <div><dl><dt>What to bring</dt><dd>{service.bring}</dd><dt>Scope to discuss</dt><dd>{service.scope}</dd></dl>
          <Link className="text-action" href={'/contact?service=' + encodeURIComponent(service.service)}>Enquire about {service.name.toLowerCase()} ↗</Link></div>
      </article>)}
    </div></section><ServiceFinder/>
  </>;
}
