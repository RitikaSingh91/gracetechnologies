export type Testimonial = Readonly<{
  id: string;
  service: string;
  quote: string;
  clientName: string;
  clientDescription: string;
  published: boolean;
  rating?: number;
}>;

export const testimonials: readonly Testimonial[] = [
  {
    id: "web-mobile-app-development-feedback",
    service: "Web & Mobile App Development",
    quote:
      "Grace Technologies helped us turn our ideas into a clean, user-friendly digital experience. The team was responsive, understood our requirements, and delivered a solution that made our business operations easier.",
    clientName: "Michael Anderson",
    clientDescription: "Business Owner, New York, USA",
    published: true,
  },
  {
    id: "merchant-account-management-feedback",
    service: "Merchant Account Management",
    quote:
      "We needed a reliable partner to help us improve our payment operations. Grace Technologies provided a practical approach, clear communication, and support throughout the process. The experience was professional from start to finish.",
    clientName: "Sarah Mitchell",
    clientDescription: "Retail Business Owner, Texas, USA",
    published: true,
  },
  {
    id: "ai-workflow-automation-feedback",
    service: "AI & Workflow Automation",
    quote:
      "Grace Technologies helped us identify opportunities to simplify repetitive tasks and improve our workflow. Their approach was straightforward, thoughtful, and focused on solving real business problems.",
    clientName: "David Wilson",
    clientDescription: "Operations Manager, California, USA",
    published: true,
  },
];
