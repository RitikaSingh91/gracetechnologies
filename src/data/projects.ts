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
    id: "rehaas",
    name: "Rehaas.in",
    service: "Web Development",
    websiteUrl: "https://rehas.in/",
    description:
      "Rehaas.in is a digital wellness and spiritual platform bringing together ancient wisdom and modern wellness practices. Its services include holistic healing, meditation, astrology, horoscope readings, and spiritual guidance. The website presents these services and personalized wellness experiences in an accessible digital format. Grace Technologies contributed to the web development of the platform, helping organize its content and digital experiences into a professional website for people exploring traditional practices and wellness.",
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
  {
    id: "work-through-frustration",
    name: "Work Through Frustration (WTF)",
    service: "Healthcare Technology | Digital Platform",
    imageSrc: "/images/wtf-logo.jpeg",
    imageAlt: "Work Through Frustration, W.T.F. University logo",
    imageWidth: 366,
    imageHeight: 472,
    caseStudyActionLabel: "Explore Case Study",
    description:
      "A healthcare-oriented digital platform designed to support individuals through a structured frustration-management and counseling journey.",
    additionalDescription:
      "It brings together patient onboarding, learning resources, assessments, therapist communication, counseling sessions, group therapy, personal reflection, and administrative governance in one organized digital experience. The platform's focus is to present these parts of the journey together, from onboarding and learning through counseling and reflection, with administrative governance included as part of the digital experience for individuals seeking structured support.",
    caseStudySections: [
      {
        heading: "Healthcare and Counseling Context",
        description:
          "Work Through Frustration is a healthcare-oriented digital platform focused on frustration management and counseling.",
      },
      {
        heading: "Platform Purpose",
        description:
          "The platform is intended to support individuals throughout a structured frustration-management and counseling journey.",
      },
      {
        heading: "Patient Onboarding and Learning",
        description:
          "Patient onboarding and learning resources are part of the platform's organized digital experience.",
      },
      {
        heading: "Assessments and Therapist Communication",
        description:
          "The platform brings together assessments and therapist communication as part of the counseling journey.",
      },
      {
        heading: "Counseling Sessions and Group Therapy",
        description:
          "Counseling sessions and group therapy are included in the platform's collection of support experiences.",
      },
      {
        heading: "Personal Reflection and Administrative Governance",
        description:
          "The platform also includes personal reflection and administrative governance.",
      },
    ],
  },
];
