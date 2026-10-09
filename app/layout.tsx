import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { HOME_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, INDEXABLE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: "%s | SRINBAR" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: { url: "/icon", type: "image/png", sizes: "96x96" },
    apple: { url: "/apple-icon", type: "image/png", sizes: "180x180" },
  },
  robots: {
    index: INDEXABLE, follow: INDEXABLE,
    googleBot: { index: INDEXABLE, follow: INDEXABLE, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={`${fraunces.variable} ${inter.variable}`}
      >
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
