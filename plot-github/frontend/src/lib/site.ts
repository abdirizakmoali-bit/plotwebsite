export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Our Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
export const services = [
  { name: "Architectural Design", description: "Turn your brief into carefully planned layouts, elevations and spaces suited to the way you live or work." },
  { name: "Structural Engineering", description: "Develop structural solutions and technical drawings with attention to safety, buildability and project requirements." },
  { name: "Estimation & BOQs", description: "Understand project quantities, expected costs and material requirements before major decisions are made." },
  { name: "Construction Management", description: "Coordinate site supervision, quality control, procurement planning and project execution." },
  { name: "Property Development", description: "Explore land use, concept planning and development opportunities with a clear commercial perspective." },
];
export const processSteps = [
  { stage: "DISCOVER", title: "Tell us your goal", description: "Share the location, size, intended use, priorities and target budget for your project." },
  { stage: "DEFINE", title: "Shape the brief", description: "Agree the scope, deliverables, programme and the technical studies your project needs." },
  { stage: "DESIGN", title: "Build the plan", description: "Review drawings, engineering options, quantities and the decisions that shape costs." },
  { stage: "DELIVER", title: "Move with confidence", description: "Where commissioned, manage execution and quality through coordinated site processes." },
];
