export type Project = Readonly<{
  id: string;
  name: string;
  service: string;
  subtitle?: string;
  websiteUrl?: string;
  wordmark?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  additionalDescription?: string;
  caseStudySections?: readonly Readonly<{
    heading: string;
    description: string;
  }>[];
  caseStudyActionLabel?: string;
  description: string;
  problem?: string;
  approach?: string;
  solution?: string;
}>;

const detailsComingSoon = "Detailed case study coming soon.";

export const projects: readonly Project[] = [
  {
    id: "rehas",
    name: "Rehas.in",
    service: "Web Development",
    websiteUrl: "https://rehas.in/",
    description:
      "Rehas.in is a digital wellness and spiritual platform bringing together ancient wisdom and modern wellness practices. Its services include holistic healing, meditation, astrology, horoscope readings, and spiritual guidance. The website presents these services and personalized wellness experiences in an accessible digital format. Grace Technologies contributed to the web development of the platform, helping organize its content and digital experiences into a professional website for people exploring traditional practices and wellness.",
    problem: detailsComingSoon,
    approach: detailsComingSoon,
    solution: detailsComingSoon,
  },
  {
    id: "flappy",
    name: "Flappy",
    service: "Merchant Account Management",
    imageSrc: "/images/flappy-logo.jpg",
    imageAlt: "Flappy shopping bag logo mark",
    imageWidth: 210,
    imageHeight: 255,
    description:
      "Flappy is an e-commerce garments business, with a project focus on merchant account management. Grace Technologies supported the business from the ground up as it established its digital commerce presence. The work brought together the needs of a garments business operating through e-commerce and merchant account management. This project description reflects the supplied scope: support during early development and the establishment of Flappy's online commerce presence, without assuming particular platform features, transaction volumes, or business results.",
    caseStudySections: [
      {
        heading: "Project Overview",
        description:
          "Flappy is an e-commerce business in the garments sector. The project is focused on merchant account management.",
      },
      {
        heading: "E-commerce in Garments",
        description:
          "Flappy operates in the garments sector and serves customers through e-commerce.",
      },
      {
        heading: "Support from the Ground Up",
        description:
          "Grace Technologies supported Flappy from the ground up as it established its digital commerce presence.",
      },
    ],
  },
];
