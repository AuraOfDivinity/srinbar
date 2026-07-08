import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { client, fetchOptions } = await import("@/sanity/client");
    const { SITE_SETTINGS_QUERY } = await import("@/sanity/queries");
    const settings = await client.fetch(SITE_SETTINGS_QUERY, {}, fetchOptions);
    if (settings?.siteTitle) {
      return {
        title: settings.siteTitle,
        description: settings.seoDescription,
      };
    }
  } catch {
    // fall through to defaults (e.g. env vars not configured yet)
  }
  return {
    title: "SRINBAR — Lanka Network for Bamboo and Rattan",
    description:
      "Restoring degraded land, stabilising riverbanks, and building bamboo livelihoods across Sri Lanka.",
  };
}

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
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}
