export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const services = [
  {
    name: "Architectural Design", description: "Turn your brief into carefully planned layouts, elevations and spaces suited to the way you live or work.",
    service: "Architectural design", bring: "Plot dimensions, the rooms you need and how your family uses them.", scope: "Floor plans, elevations and a design review before detailed drawings."
  },
  {
    name: "Structural Engineering", description: "Develop structural solutions and technical drawings with attention to safety, buildability and project requirements.",
    service: "Structural engineering", bring: "The architectural drawings, site information and any available ground investigation.", scope: "A structural scheme coordinated with the layout, followed by agreed calculations, drawings and schedules."
  },
  {
    name: "Estimation & BOQs", description: "Understand project quantities, expected costs and material requirements before major decisions are made.",
    service: "Cost estimation / BOQ", bring: "Dated drawings, finish preferences and the items you intend to supply yourself.", scope: "Measured quantities, pricing assumptions and a list of exclusions for comparing quotations."
  },
  {
    name: "Construction Management", description: "Coordinate site supervision, quality control, procurement planning and project execution.",
    service: "Construction management", bring: "The current drawings, contractor’s programme and any work already in progress.", scope: "A site reporting schedule, inspection responsibilities and a record of decisions and changes."
  },
  {
    name: "Property Development", description: "Explore land use, concept planning and development opportunities with a clear commercial perspective.",
    service: "Property development", bring: "The location, dimensions, access and your intended use for the land.", scope: "A review of layout options, potential uses and the questions to resolve before commissioning a feasibility study."
  }
];
export const processSteps = [
  { stage: "DISCOVER", title: "Tell us your goal", description: "Share the location, size, intended use, priorities and target budget for your project." },
  { stage: "DEFINE", title: "Shape the brief", description: "Agree the scope, deliverables, programme and the technical studies your project needs." },
  { stage: "DESIGN", title: "Build the plan", description: "Review drawings, engineering options, quantities and the decisions that shape costs." },
  { stage: "DELIVER", title: "Move with confidence", description: "Where commissioned, manage execution and quality through coordinated site processes." },
];
