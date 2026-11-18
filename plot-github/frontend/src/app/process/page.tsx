import {Questions} from "@/components/LeadExperience";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { processSteps } from "@/lib/site";
import Link from "next/link";
export const metadata:Metadata={title:"Our Process",description:"Learn how PLOT approaches project consultation, scoping, design and construction delivery."};
export default function Process(){return <><PageHero eyebrow="The PLOT process" title="Clear thinking before construction." description="From brief to delivery, a structured process helps you understand what is happening, what decisions are needed, and what comes next."/><section className="process section"><div className="shell"><div className="steps">{processSteps.map((s,i)=><div className="step" key={s.stage}><b>{String(i+1).padStart(2,"0")} / {s.stage}</b><h3>{s.title}</h3><p>{s.description}</p></div>)}</div><div className="actions"><Link className="btn" href="/contact">START YOUR PROJECT ↗</Link></div></div></section><Questions/></>}
