import type { ReactNode } from "react";
import { companyInformation } from "@/data/company-information";

export type SocialLink = Readonly<{
  name: string;
  href: string;
  icon: ReactNode;
  opensNewTab: boolean;
}>;

export const socialLinks: readonly SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/gracetechnologiesofficial/",
    opensNewTab: true,
    icon: (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
          width="17"
          x="3.5"
          y="3.5"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.5" cy="6.8" fill="currentColor" r="1" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://in.pinterest.com/gracetechnologiesofficial/",
    opensNewTab: true,
    icon: (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <text
          fill="currentColor"
          fontFamily="Georgia, serif"
          fontSize="14"
          fontWeight="700"
          x="8.1"
          y="17.2"
        >
          P
        </text>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Gracetechnologiesofficial",
    opensNewTab: true,
    icon: (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect
          height="13"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.8"
          width="19"
          x="2.5"
          y="5.5"
        />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/grace_Official4",
    opensNewTab: true,
    icon: (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.62L5.38 22H2.25l7.25-8.29L1.8 2h6.4l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.27 3.9H5.4L17.8 20Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1EFVF3FZ1N/",
    opensNewTab: true,
    icon: (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.4 21v-8.2h2.75l.41-3.2H13.4V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14A22.6 22.6 0 0 0 14.2 3c-2.47 0-4.16 1.5-4.16 4.27V9.6H7.25v3.2h2.79V21h3.36Z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: `mailto:${companyInformation.email}`,
    opensNewTab: false,
    icon: (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          width="19"
          x="2.5"
          y="4.5"
        />
        <path
          d="m3.5 6 8.5 7 8.5-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
];
