"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
const concepts = [
 {name:"A considered welcome",type:"Exterior",image:"/home.webp",detail:"A contemporary home concept with a sheltered entrance, warm stone, charcoal accents and a landscaped courtyard. A balance of presence and privacy.",tags:"Architecture · Landscape · Arrival"},
 {name:"Room to unwind",type:"Interior",image:"/living.webp",detail:"A living room concept centred on comfortable seating, warm neutral finishes and natural textures. An inviting space to gather and slow down.",tags:"Living space · Materials · Comfort"},
 {name:"Everyday, elevated",type:"Interior",image:"/kitchen.webp",detail:"An open kitchen and dining concept that brings cooking, conversation and daily routines together in a calm, coherent space.",tags:"Kitchen · Dining · Everyday living"}
];
export function ProjectCards(){
 const [filter,setFilter]=useState("All concepts");
 const [selected,setSelected]=useState<number|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(selected!==null)dialog.current?.showModal();},[selected]);
 return <><div className="portfolio-toolbar"><span>RESIDENTIAL STUDY / 01</span><div className="filters" aria-label="Filter concepts">{["All concepts","Exterior","Interior"].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div></div><div className="project-grid">{concepts.map((c,i)=>(filter==="All concepts"||filter===c.type)&&<button type="button" className="project-card" key={c.name} onClick={()=>setSelected(i)} aria-label={`Explore ${c.name}`}><div className="project-img"><img src={c.image} alt={c.name+", architectural concept visual"} loading="lazy"/><span className="project-open">↗</span></div><div className="project-label">0{i+1} / {c.type} concept</div><div className="project-name">{c.name}</div><div className="project-note">{c.tags}</div></button>)}</div><p className="projects-note">AI-assisted design visualisations. Concept studies, not completed client projects.</p>
 <dialog ref={dialog} className="concept-dialog" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>{selected!==null&&<><button className="dialog-close" aria-label="Close concept" onClick={()=>dialog.current?.close()}>×</button><img src={concepts[selected].image} alt={concepts[selected].name+" concept"}/><div className="dialog-copy"><div className="label">Residential design study</div><h2>{concepts[selected].name}</h2><p>{concepts[selected].detail}</p><p className="projects-note">AI-assisted concept visualisation. Not a completed project.</p><Link className="btn" href="/contact" onClick={()=>dialog.current?.close()}>PLAN SOMETHING LIKE THIS ↗</Link></div></>}</dialog></>;
}
