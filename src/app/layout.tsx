import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const siteDescription =
  "Grace Technologies Ltd. and ANK Square Pvt. Ltd. provide technology and business services for organizations across the USA and India.";

export const metadata: Metadata = {
  title: {
    default: "Grace Technologies Ltd. | Thoughtful Technology",
    template: "%s | Grace Technologies Ltd.",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    title: "Grace Technologies Ltd. | Thoughtful Technology",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en">
      <body>{children}</body>
    </html>
  );
}
