"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
const routes = [
 {label:'I want to build a home',service:'Architectural design',title:'Start with a design that fits your life.',detail:'Explore your brief, site, room requirements and priorities. Then define the drawings and engineering your home needs.',items:['Your site and family needs','Space planning and design direction','A clear scope for the next stage']},
 {label:'I need clarity on costs',service:'Cost estimation / BOQ',title:'Make the numbers part of the plan.',detail:'Bring your drawings or describe your idea. We can help define the quantities, scope and assumptions behind a project budget.',items:['Drawing and scope review','Measured quantities and specifications','A basis for comparing contractor prices']},
 {label:'I am ready to build',service:'Construction management',title:'Turn the plan into a coordinated site.',detail:'Discuss supervision, scheduling, procurement and quality control, with responsibilities agreed before work starts.',items:['Programme and site priorities','Procurement and quality planning','Progress reporting and coordination']},
 {label:'I have land to develop',service:'Property development',title:'Understand what your plot could become.',detail:'Explore intended use, access, development options and commercial priorities before committing to a concept.',items:['Site opportunities and constraints','Concept and land-use options','Feasibility questions to resolve']}
];
export function ServiceFinder(){
 const [active,setActive]=useState(0); const r=routes[active];
 return <section className="finder section"><div className="shell"><div className="sectionhead"><div><div className="label">Find your starting point</div><h2>What brings you<br/>to PLOT?</h2></div><p>You do not need to know every technical detail. Choose the situation closest to yours and find a practical next step.</p></div><div className="finder-grid"><div className="finder-options" aria-label="Choose your project goal">{routes.map((r,i)=><button key={r.label} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span>{r.label}<b>→</b></button>)}</div><div className="finder-result" aria-live="polite"><div className="label">Your starting point / {r.service}</div><h3>{r.title}</h3><p>{r.detail}</p><ul>{r.items.map(item=><li key={item}>{item}</li>)}</ul><Link className="btn" href={`/contact?service=${encodeURIComponent(r.service)}`}>BUILD MY PROJECT BRIEF →</Link></div></div></div></section>;
}
const questions=[
 ['Can I start if I only have an idea?','Yes. Start with your intended use, preferred location, approximate budget and priorities. Your initial brief helps identify the information needed before design begins.'],
 ['Can I work with PLOT while living abroad?','Tell us where you are based and how you prefer to communicate. We can discuss a remote review and reporting arrangement as part of your project scope.'],
 ['Do I need drawings before requesting a cost estimate?','Drawings and specifications make quantities and pricing more meaningful. If you do not have them yet, start with a brief so the next design and estimation steps can be defined.'],
 ['Does submitting a brief commit me to a contract?','No. An enquiry starts a conversation. Scope, fees, responsibilities and programme need to be agreed separately before commissioned work starts.']
];
export function Questions(){return <section className="section faq"><div className="shell split"><div><div className="label">Before you begin</div><h2>A few things<br/>worth knowing.</h2><p>Good projects begin with clear expectations.</p><a className="checklist-link" href="/before-you-build.txt" download>↓ Download your pre-build checklist</a></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></section>;}
export function ConversionTools(){
 const [progress,setProgress]=useState(0);const [show,setShow]=useState(false);
 const whatsapp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'').replace(/\D/g,'');
 useEffect(()=>{
  const onScroll=()=>{const total=document.documentElement.scrollHeight-window.innerHeight;setProgress(total>0?window.scrollY/total*100:0);setShow(window.scrollY>500);};onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  try{if(!sessionStorage.getItem('plot-attribution')){const params=new URLSearchParams(location.search);const saved:Record<string,string>={landing_path:location.pathname.slice(0,200)};for(const key of ['utm_source','utm_medium','utm_campaign'])saved[key]=(params.get(key)||'').slice(0,150);sessionStorage.setItem('plot-attribution',JSON.stringify(saved));}}catch{/* No storage means no attribution, not a broken form. */}
  return()=>window.removeEventListener('scroll',onScroll);
 },[]);
 return <><div className="reading-progress" style={{width:`${progress}%`}} aria-hidden="true"/>{show&&<aside className="conversion-bar" aria-label="Start your project"><span>Your idea deserves a clear plan.</span>{whatsapp.length>=7&&<a className="whatsapp-link" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello PLOT, I would like to discuss a project.')}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}<Link className="btn" href="/contact">START YOUR PROJECT →</Link></aside>}</>;
}
