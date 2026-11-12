export function PageHero({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
 return <section className="innerpage-hero"><div className="shell"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></section>
}
