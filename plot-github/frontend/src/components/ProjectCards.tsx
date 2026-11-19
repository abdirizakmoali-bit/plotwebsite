"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const studies = [
  {
    name: "A courtyard home in Hargeisa", type: "Exterior", label: "Exterior photograph",
    image: "/studio/hargeisa-courtyard.webp", alt: "A stone-faced house with a curved balcony and low courtyard wall in Hargeisa",
    detail: "The low courtyard wall follows the curve of the balcony. Stone cladding gives the front elevation texture, while the recessed entrance creates shade beside the door.",
    tags: "Courtyard · Stonework · Entrance", photo: true,
  },
  {
    name: "Room to unwind", type: "Interior", label: "Interior concept", image: "/living.webp",
    alt: "Living room concept with neutral finishes and seating around a low table",
    detail: "A living room concept centred on comfortable seating, warm neutral finishes and natural textures. An inviting space to gather and slow down.",
    tags: "Living space · Materials · Comfort", photo: false,
  },
  {
    name: "Everyday, elevated", type: "Interior", label: "Interior concept", image: "/kitchen.webp",
    alt: "Open kitchen concept with an island and an adjoining dining area",
    detail: "An open kitchen and dining concept that brings cooking, conversation and daily routines together in a calm, coherent space.",
    tags: "Kitchen · Dining · Everyday living", photo: false,
  },
];

function HousePhotoCredit() {
  return <><a href="https://commons.wikimedia.org/wiki/File:House_in_Hargeisa_2.jpg">Photograph by Unieco</a> · <a href="https://creativecommons.org/licenses/by-sa/1.0/">CC BY-SA 1.0</a> · Adapted to WebP.</>;
}

export function ProjectCards() {
  const [filter, setFilter] = useState("All studies");
  const [selected, setSelected] = useState<(typeof studies)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);

  return <>
    <div className="portfolio-toolbar">
      <span>Residential studies</span>
      <div className="filters" aria-label="Filter studies">
        {["All studies", "Exterior", "Interior"].map(type =>
          <button key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}</button>)}
      </div>
    </div>
    <div className="project-grid">
      {studies.map((study, i) => (filter === "All studies" || filter === study.type) &&
        <button type="button" className="project-card" key={study.name} onClick={() => setSelected(study)} aria-label={`Explore ${study.name}`}>
          <div className="project-img"><img src={study.image} alt={study.alt} loading="lazy"/><span className="project-open" aria-hidden="true">↗</span></div>
          <div className="project-label">0{i + 1} / {study.label}</div>
          <div className="project-name">{study.name}</div><div className="project-note">{study.tags}</div>
        </button>)}
    </div>
    {filter !== "Interior" && <p className="projects-note"><HousePhotoCredit /></p>}
    {filter !== "Exterior" && <p className="projects-note">The interiors are AI-assisted design studies.</p>}
    <dialog ref={dialog} className="concept-dialog" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      {selected && <>
        <button className="dialog-close" aria-label="Close study" onClick={() => dialog.current?.close()}>×</button>
        <img src={selected.image} alt={selected.alt}/>
        <div className="dialog-copy">
          <div className="label">{selected.label}</div><h2>{selected.name}</h2><p>{selected.detail}</p>
          <p className="projects-note">{selected.photo ? <HousePhotoCredit /> : "AI-assisted interior design study."}</p>
          <Link className="btn" href="/contact" onClick={() => dialog.current?.close()}>Plan something like this</Link>
        </div>
      </>}
    </dialog>
  </>;
}
