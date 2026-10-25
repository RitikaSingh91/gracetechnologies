export const contactServices = [
  "Web & Mobile App Development",
  "Merchant Account Management",
  "Agentic AI & Workflow Automation",
  "Digital Marketing",
  "Other",
] as const;

export type ContactService = (typeof contactServices)[number];
