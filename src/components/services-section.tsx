import type { ReactNode } from "react";
import { ServiceCard } from "@/components/service-card";

export type Service = Readonly<{
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  image?: Readonly<{
    src: string;
    alt: string;
    position: "left" | "right";
    width: number;
    height: number;
  }>;
  keyFeatures: readonly Readonly<{
    title: string;
    description: string;
  }>[];
  useCases: readonly string[];
  details: Readonly<{
    heading: string;
    challenge: string;
    approach: readonly Readonly<{ heading: string; description: string }>[];
    cta: string;
  }>;
}>;

export const services: readonly Service[] = [
  {
    id: "web-mobile-app-development",
    title: "Web & Mobile App Development",
    description:
      "We design and develop responsive websites and mobile applications tailored to business needs.",
    image: {
      src: "/images/web-development.png",
      alt: "Developer working at a laptop with code and gears",
      position: "right",
      width: 956,
      height: 716,
    },
    keyFeatures: [
      {
        title: "Responsive web and mobile experiences",
        description:
          "Make it easier for customers to use your digital service across phones, tablets, and desktops.",
      },
      {
        title: "User-focused design and development",
        description:
          "Give visitors clear journeys and useful content aligned with your business goals.",
      },
      {
        title: "Testing and launch support",
        description:
          "Prepare your product for launch and identify practical opportunities to improve it over time.",
      },
    ],
    useCases: [
      "Launching a new business website or customer-facing web application.",
      "Improving an existing website that is difficult to use on mobile devices.",
      "Planning a mobile application to support a specific customer or operational need.",
    ],
    details: {
      heading: "Digital Products Built Around Your Business",
      challenge:
        "Every business has different digital needs. Whether you are launching a new product, modernizing an existing website, or improving your customers' digital experience, we start by understanding your business goals and the challenges you face.",
      approach: [
        {
          heading: "Discovery & Planning",
          description:
            "Understand your target audience, business objectives, existing technology, and project requirements.",
        },
        {
          heading: "Strategy & Design",
          description:
            "Develop a tailored solution with intuitive user experiences, responsive interfaces, and clear functionality.",
        },
        {
          heading: "Development & Testing",
          description:
            "Build websites and mobile applications with a focus on performance, usability, security, and scalability.",
        },
        {
          heading: "Launch & Improvement",
          description:
            "Support the launch process and identify opportunities for future enhancements.",
        },
      ],
      cta: "Discuss Your Digital Project",
    },
    icon: (
      <svg fill="none" viewBox="0 0 32 32">
        <rect height="19" rx="2" stroke="currentColor" strokeWidth="1.6" width="26" x="3" y="5" />
        <path d="M3 10h26M12 27h8M16 24v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <circle cx="6.5" cy="7.5" fill="currentColor" r=".75" />
        <circle cx="9.5" cy="7.5" fill="currentColor" r=".75" />
      </svg>
    ),
  },
  {
    id: "merchant-account-management",
    title: "Merchant Account Management",
    description:
      "We help businesses navigate merchant account setup and payment processing support.",
    image: {
      src: "/images/merchant-account-management.jpg",
      alt: "Two professionals discussing across a desk with a laptop",
      position: "left",
      width: 2400,
      height: 1800,
    },
    keyFeatures: [
      {
        title: "Business and payment-needs assessment",
        description:
          "Clarify your business model, payment requirements, and the account setup questions that need attention.",
      },
      {
        title: "Provider and documentation guidance",
        description:
          "Understand provider requirements and organize the business information needed for an application.",
      },
      {
        title: "Practical ongoing support",
        description:
          "Get help understanding payment workflows and addressing account-management questions as they arise.",
      },
    ],
    useCases: [
      "A new online business preparing to accept customer payments.",
      "A growing merchant reviewing payment-provider options and requirements.",
      "A business that needs help organizing documentation or understanding payment operations.",
    ],
    details: {
      heading: "Payment Solutions That Support Your Business",
      challenge:
        "Payment processing can become complicated when businesses face provider requirements, documentation challenges, or changing operational needs. We help businesses understand their options and navigate the merchant account management process.",
      approach: [
        {
          heading: "Business Assessment",
          description:
            "Understand your business model, products or services, transaction needs, and payment requirements.",
        },
        {
          heading: "Provider & Requirement Review",
          description:
            "Help identify suitable payment processing options and understand the relevant provider requirements.",
        },
        {
          heading: "Application Support",
          description:
            "Assist with preparing business information and organizing the documentation needed for an application.",
        },
        {
          heading: "Ongoing Guidance",
          description:
            "Help businesses understand payment processing workflows and address operational questions as they arise.",
        },
      ],
      cta: "Discuss Your Payment Needs",
    },
    icon: (
      <svg fill="none" viewBox="0 0 32 32">
        <rect height="22" rx="2" stroke="currentColor" strokeWidth="1.6" width="26" x="3" y="5" />
        <path d="M3 12h26M8 19h7M8 23h11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <circle cx="24" cy="20" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: "agentic-ai-workflow-automation",
    title: "Agentic AI & Workflow Automation",
    description:
      "We explore AI-powered workflows and automation to help businesses simplify repetitive tasks.",
    image: {
      src: "/images/agentic-ai.svg",
      alt: "Artificial intelligence illustration representing smart business workflows",
      position: "right",
      width: 500,
      height: 500,
    },
    keyFeatures: [
      {
        title: "Workflow discovery",
        description:
          "Find repetitive tasks, hand-offs, and manual information handling that may be suitable for improvement.",
      },
      {
        title: "AI-assisted process design",
        description:
          "Explore fit-for-purpose automation while keeping people involved in decisions that need human judgment.",
      },
      {
        title: "Implementation and evaluation",
        description:
          "Assess a workflow for usability, reliability, and business value before planning further improvements.",
      },
    ],
    useCases: [
      "Reducing repetitive data entry or document-handling steps.",
      "Coordinating routine tasks across teams or business tools.",
      "Exploring AI assistance for internal knowledge or customer-service workflows.",
    ],
    details: {
      heading: "Turn Repetitive Work Into Smarter Workflows",
      challenge:
        "Many businesses spend valuable time on repetitive tasks, manual data handling, and disconnected workflows. We explore practical AI and automation solutions that help teams simplify operations and focus on higher-value work.",
      approach: [
        {
          heading: "Identify the Bottleneck",
          description:
            "Understand which tasks consume time, create delays, or require repetitive manual effort.",
        },
        {
          heading: "Map the Workflow",
          description:
            "Review how information moves between people, systems, and business processes.",
        },
        {
          heading: "Design a Tailored Solution",
          description:
            "Identify opportunities for AI-assisted workflows, automation, and intelligent task coordination.",
        },
        {
          heading: "Implement & Evaluate",
          description:
            "Develop an appropriate workflow and evaluate its reliability, usability, and business value.",
        },
      ],
      cta: "Explore AI for Your Business",
    },
    icon: (
      <svg fill="none" viewBox="0 0 32 32">
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" width="10" x="11" y="3" />
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" width="10" x="3" y="22" />
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" width="10" x="19" y="22" />
        <path d="M16 10v5m-8 7v-3h16v3m-8-7-8 4m8-4 8 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description:
      "We help businesses strengthen their online presence through digital marketing and growth-focused strategies.",
    image: {
      src: "/images/digital-marketing.jpg",
      alt: "Business owner reviewing a declining financial graph on a laptop",
      position: "left",
      width: 6251,
      height: 4690,
    },
    keyFeatures: [
      {
        title: "Audience and channel planning",
        description:
          "Understand who you want to reach and where your customers are most likely to find you.",
      },
      {
        title: "Consistent digital messaging",
        description:
          "Align your website, search presence, and marketing content around clear business objectives.",
      },
      {
        title: "Measurement and refinement",
        description:
          "Use available performance information to identify useful adjustments to campaigns and content.",
      },
    ],
    useCases: [
      "Building an online presence for a new business or service.",
      "Reviewing existing marketing channels to find gaps or inconsistent messaging.",
      "Planning a focused campaign to reach a defined customer audience.",
    ],
    details: {
      heading: "Build Your Digital Presence With Purpose",
      challenge:
        "A strong online presence begins with understanding your audience and communicating the right message. We help businesses develop digital marketing strategies that align with their goals, market, and customer needs.",
      approach: [
        {
          heading: "Understand Your Audience",
          description:
            "Identify your target customers, their needs, and how they discover businesses online.",
        },
        {
          heading: "Review Your Digital Presence",
          description:
            "Evaluate your website, messaging, search visibility, and existing marketing channels.",
        },
        {
          heading: "Build a Tailored Strategy",
          description:
            "Develop a marketing approach that reflects your business objectives, audience, and budget.",
        },
        {
          heading: "Measure & Refine",
          description:
            "Review available performance data and identify opportunities to improve campaigns and customer engagement.",
        },
      ],
      cta: "Build Your Marketing Strategy",
    },
    icon: (
      <svg fill="none" viewBox="0 0 32 32">
        <path d="M4 25V7m0 18h24" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <path d="m8 21 6-6 4 3 8-9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M20 9h6v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  return (
    <section
      aria-labelledby="services-title"
      className="services-section page-container"
      id="services"
    >
      <div className="section-heading">
        <p className="eyebrow">How we help</p>
        <h2 id="services-title">Technology for your next chapter.</h2>
        <p>
          Practical digital services to help your business build, simplify, and
          grow.
        </p>
      </div>

      <ul className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            learnMoreHref={`/services/${service.id}`}
          />
        ))}
      </ul>
    </section>
  );
}
