import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProjectCards } from "@/components/ProjectCards";

export const metadata: Metadata = {
  title: "Ongoing projects, finished projects & design studies",
  description: "Explore the PLOT project portfolio and residential design studies."
};

export default function Projects() {
  return <>
    <PageHero eyebrow="Projects & concepts" title="The project portfolio." description="Browse work by stage, or explore the residential studies below for ideas for your own brief." />
    <nav className="shell portfolio-index" aria-label="Project sections">
      <a href="#ongoing">Ongoing projects ↓</a>
      <a href="#finished">Finished projects ↓</a>
      <a href="#studies">Design studies ↓</a>
    </nav>
    <div className="shell project-stages">
      <section id="ongoing">
        <h2>Ongoing projects</h2>
        <p>No site updates have been published yet.</p>
        <p>For a current project reference, tell us which stage interests you, from site preparation and structural work to finishes.</p>
        <a className="text-action" href="https://wa.me/252638339599?text=Hello%20PLOT%2C%20I%27d%20like%20to%20ask%20about%20current%20project%20references.">Ask about current work ↗</a>
      </section>
      <section id="finished">
        <h2>Finished projects</h2>
        <p>No handover case studies have been published yet.</p>
        <p>Looking for a similar home or development? Share the building type and the scope you want to see, such as design, costing or construction management.</p>
        <a className="text-action" href="mailto:info@plotdevelopments.com?subject=Completed%20project%20reference">Request a project reference ↗</a>
      </section>
    </div>
    <section id="studies" className="projects section"><div className="shell">
      <h2 className="feature-heading">Residential design studies</h2>
      <p className="section-intro">Explore a house in Hargeisa and two interior design studies. Select a view for a closer look.</p>
      <ProjectCards/>
      <Link className="text-action" href="/contact?service=Architectural%20design">Discuss a design for your plot ↗</Link>
    </div></section>
  </>;
}
