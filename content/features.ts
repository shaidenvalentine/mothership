import type { Feature } from "@/types";

/**
 * Eight things that define a Mothership, in homepage order. Copy is grounded in
 * the real Buckley/bucksd.com positioning (Mercedes Sprinter, proprietary
 * 3D-printed interior, luxury stealth camper). No fabricated specs.
 */
export const features: Feature[] = [
  {
    id: "printed-architecture",
    index: "01",
    title: "Proprietary 3D-printed interior",
    subtitle: "One design, perfected — printed, not pieced together.",
    keySpec: "Proprietary 3D-printed build",
    learnMoreHref: "/technology",
    image: "/images/render-consoles.png",
  },
  {
    id: "electric-self-charging",
    index: "02",
    title: "All-electric, self-charging drivetrain",
    subtitle: "Silent power that never needs a plug.",
    keySpec: "All-electric · solar self-charging",
    learnMoreHref: "/technology",
    image: "/images/exterior-head-on.jpg",
  },
  {
    id: "self-contained",
    index: "03",
    title: "Off-grid for weeks",
    subtitle: "Provisioned, powered, ready to disappear.",
    keySpec: "Fully self-contained",
    learnMoreHref: "/technology",
    image: "/images/systems-rear-doors.jpg",
  },
  {
    id: "bathroom",
    index: "04",
    title: "A private bathroom on board",
    subtitle: "Five-star comfort, anywhere on Earth.",
    keySpec: "Full bath + toilet",
    learnMoreHref: "/technology",
    image: "/images/render-toilet.jpg",
  },
  {
    id: "galley-kitchen",
    index: "05",
    title: "A full galley kitchen",
    subtitle: "Cook like you never left home.",
    keySpec: "Integrated galley",
    learnMoreHref: "/technology",
    image: "/images/render-kitchen.jpg",
  },
  {
    id: "shower",
    index: "06",
    title: "Hot shower, anywhere",
    subtitle: "End every day clean.",
    keySpec: "Indoor shower",
    learnMoreHref: "/technology",
    image: "/images/render-shower.jpg",
  },
  {
    id: "stealth-exterior",
    index: "07",
    title: "Luxury stealth exterior",
    subtitle: "All the luxury inside. Invisible from the curb.",
    keySpec: "Stealth on the Mercedes Sprinter",
    learnMoreHref: "/technology",
    image: "/images/exterior-front.jpg",
  },
  {
    id: "mobile-office",
    index: "08",
    title: "A mobile office with a view",
    subtitle: "Park anywhere. Work everywhere.",
    keySpec: "Workspace + connectivity",
    learnMoreHref: "/technology",
    image: "/images/render-desk.jpg",
  },
];
