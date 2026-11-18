const images: Record<string, [string,string]> = {
  "Our expertise": ["drawings", "Architectural elevations"],
  "The PLOT process": ["site", "Modern home under construction"],
  "Projects & concepts": ["villa", "Contemporary villa design reference"],
  "Our philosophy": ["residences", "Landscaped residential buildings"],
  "PLOT journal": ["drawings", "Residential elevation studies"],
  "Project enquiries": ["site", "Residential construction reference"]
};
export function PageHero({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  const image = images[eyebrow];
  return <section className="mast shell"><div><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
    {image && <img src={'/studio/' + image[0] + '.webp'} alt={image[1]}/>}</section>;
}
