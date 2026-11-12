import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectCards } from "@/components/ProjectCards";
export const metadata:Metadata={title:"Projects & Architectural Concepts",description:"Explore the architectural concepts and design approach of PLOT in Hargeisa, Somaliland."};
export default function Projects(){return <><PageHero eyebrow="Projects & concepts" title="A place for ideas worth building." description="Explore a residential concept from the outside in. Thoughtful proportions, warm materials and spaces made for everyday life."/><section className="projects section"><div className="shell"><ProjectCards/></div></section></>}
