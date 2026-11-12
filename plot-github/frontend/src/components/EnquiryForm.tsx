"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
const services = ["Architectural design","Structural engineering","Cost estimation / BOQ","Construction management","Property development","Other / Not sure yet"];
const budgets = ["Not decided","Under $50,000","$50,000–$100,000","$100,000–$250,000","$250,000+"];
const stages = ["Idea stage","Land secured","Design in progress","Ready to build","Already building"];
const timelines = ["Exploring options","Within 3 months","3–6 months","6–12 months"];
const initial = {service:"Architectural design", project_stage:"Idea stage",budget:"Not decided",timeline:"Exploring options",location:"",brief:"",full_name:"",phone:"",email:"",contact_preference:"whatsapp",website:""};
type Fields=typeof initial;
export function EnquiryForm(){
 const api=process.env.NEXT_PUBLIC_API_URL;
 const [data,setData]=useState<Fields>(initial);
 const [step,setStep]=useState(0);
 const [consent,setConsent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [receipt,setReceipt]=useState("");
 const [notice,setNotice]=useState("");
 const token=useRef("");
 const heading=useRef<HTMLHeadingElement>(null);
 function change(key:keyof Fields,value:string){setData(d=>({...d,[key]:value}));setErrors(e=>({...e,[key]:""}));}
 useEffect(()=>{
  token.current=crypto.randomUUID();
  const suggested=new URLSearchParams(window.location.search).get('service');
  if(suggested&&services.includes(suggested))setData(d=>({...d,service:suggested}));
 },[]);
 function move(next:number){setStep(next);setErrors({});setNotice("");requestAnimationFrame(()=>heading.current?.focus());}
 function fieldError(key:string){return errors[key]?<span id={`error-${key}`} className="field-error">{errors[key]}</span>:null;}
 function input(key:keyof Fields,label:string,required=false,type="text",maxLength=100){return <div className="field"><label htmlFor={`lead-${key}`}>{label}{required?' *':''}</label><input id={`lead-${key}`} name={key} type={type} value={data[key]} onChange={e=>change(key,e.target.value)} required={required} maxLength={maxLength} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`error-${key}`:undefined} autoComplete={key==='full_name'?'name':key==='phone'?'tel':key==='email'?'email':'off'}/>{fieldError(key)}</div>;}
 function select(key:keyof Fields,label:string,options:string[]){return <div className="field"><label htmlFor={`lead-${key}`}>{label}</label><select id={`lead-${key}`} value={data[key]} onChange={e=>change(key,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>{fieldError(key)}</div>;}
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); if(busy)return;
  if(step<2){move(step+1);return;}
  const invalid:Record<string,string>={};
  if(data.phone.replace(/\D/g,'').length<7)invalid.phone='Enter a valid phone number with at least 7 digits.';
  if(data.contact_preference==='email'&&!data.email)invalid.email='Please enter your email address.';
  if(!consent)invalid.consent='Please agree to be contacted about your project.';
  if(Object.keys(invalid).length){setErrors(invalid);return;}
  if(!api){
   const text=['PLOT | Project brief','',...Object.entries(data).filter(([k])=>k!=='website').map(([k,v])=>`${k.replaceAll('_',' ')}: ${v}`)].join('\n');
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='plot-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setNotice('Brief downloaded. This preview has not sent your details to PLOT.');return;
  }
  setBusy(true);setErrors({});setNotice('');
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  let attribution:Record<string,string>={};
  try{attribution=JSON.parse(sessionStorage.getItem('plot-attribution')||'{}');}catch{/* Storage can be disabled. */}
  try{
   const res=await fetch(`${api.replace(/\/$/,'')}/api/enquiries/`,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({...data,...attribution,consent,submission_id:token.current})});
   const result=await res.json().catch(()=>({}));
   if(!res.ok){
    if(res.status===400){const mapped=Object.fromEntries(Object.entries(result).map(([k,v])=>[k,Array.isArray(v)?v.join(' '):String(v)]));setErrors(mapped);if(['service','project_stage','budget','timeline'].some(k=>mapped[k]))setStep(0);else if(mapped.location||mapped.brief)setStep(1);}
    setNotice(res.status===429?'Too many attempts. Please wait before trying again.':res.status===400?'Please check the highlighted fields.':'We could not send your enquiry. Your details are still here; please try again.');return;
   }
   setReceipt(result.reference);setData(initial);setConsent(false);
  }catch{setNotice('The connection was interrupted. Please try again. Retrying will not create a duplicate enquiry.');}
  finally{clearTimeout(timeout);setBusy(false);}
 }
 if(receipt)return <div className="contact-form lead-success" role="status"><span className="success-icon">✓</span><div className="eyebrow">Enquiry received</div><h3>Your next chapter starts here.</h3><p>Your project details are now with PLOT. We will use your preferred contact method to discuss the next step.</p><p className="receipt">Reference: {receipt}</p><button className="btn" onClick={()=>{setReceipt('');token.current=crypto.randomUUID();move(0);}}>Plan another project →</button></div>;
 return <div className="contact-form lead-form"><div className="form-top"><span>YOUR PROJECT, IN THREE STEPS</span><span>0{step+1} / 03</span></div><div className="step-meter" aria-label={`Step ${step+1} of 3`}>{['Your plans','The details','Let’s connect'].map((s,i)=><span key={s} className={i<=step?'complete':''}>{s}</span>)}</div><h3 ref={heading} tabIndex={-1}>{['What are you planning?','Give your vision some context.','Where can we reach you?'][step]}</h3>{!api&&<p className="preview-note">Preview mode: complete your brief to download it. Online enquiries are not connected yet.</p>}
 <form onSubmit={submit}><fieldset disabled={busy}>
 {step===0&&<>{select('service','How can PLOT help?',services)}<div className="formrow">{select('project_stage','Where are you now?',stages)}{select('timeline','When would you like to start?',timelines)}</div>{select('budget','Indicative total project budget (USD)',budgets)}<p className="privacy-note">This helps us understand the scope. It is not a quote or a commitment.</p></>}
 {step===1&&<>{input('location','Project location',true)}<div className="field"><label htmlFor="lead-brief">What would you like to achieve? *</label><textarea id="lead-brief" required minLength={10} maxLength={1500} rows={5} placeholder="For example: a four-bedroom family home on a plot in Hargeisa. Tell us your priorities, site size and any drawings you already have." value={data.brief} onChange={e=>change('brief',e.target.value)} aria-invalid={!!errors.brief}/>{fieldError('brief')}<small>{data.brief.length} / 1500</small></div></>}
 {step===2&&<><div className="brief-summary"><b>{data.service}</b><span>{data.location} · {data.project_stage}</span><span>{data.budget} · {data.timeline}</span><button type="button" onClick={()=>move(0)}>Edit project details</button></div>{input('full_name','Your name',true)}<div className="formrow">{input('phone','Phone or WhatsApp',true,'tel',60)}{input('email','Email',data.contact_preference==='email','email',254)}</div><div className="field"><label htmlFor="lead-preference">Preferred contact method</label><select id="lead-preference" value={data.contact_preference} onChange={e=>change('contact_preference',e.target.value)}><option value="whatsapp">WhatsApp</option><option value="phone">Phone call</option><option value="email">Email</option></select></div><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>I agree that PLOT may contact me about this project. <Link href="/privacy" target="_blank">Privacy notice</Link>.</span></label>{fieldError('consent')}</>}
 <div className="honey" aria-hidden="true"><label htmlFor="lead-website">Leave this empty</label><input id="lead-website" value={data.website} onChange={e=>change('website',e.target.value)} tabIndex={-1} autoComplete="off"/></div>
 <div className="form-actions">{step>0&&<button className="back-button" type="button" onClick={()=>move(step-1)}>← Back</button>}<button className="btn" type="submit">{busy?'SENDING…':step<2?'CONTINUE →':api?'REQUEST A PROJECT CONSULTATION →':'DOWNLOAD PROJECT BRIEF →'}</button></div></fieldset>
 {notice&&<p className="form-result" role="status">{notice}</p>}
 <p className="privacy-note">{api?'Your details are used to respond to this project enquiry. No marketing sign-up.':'Your contact details are not sent or saved by this preview.'}</p>
 </form></div>;
}
