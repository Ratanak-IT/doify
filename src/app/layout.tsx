import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import RootProviders from "./RootProviders";

const BASE_URL = "https://doify-self.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Doify — Where teams move work forward",
    template: "%s | Doify",
  },
  description:
    "Doify is a modern task management platform. Plan smarter, collaborate in real time, and ship work without the chaos. From daily to-dos to full project pipelines.",
  keywords: [
    "task management",
    "project management",
    "team collaboration",
    "kanban board",
    "productivity",
    "doify",
  ],
  authors: [{ name: "Doify Team", url: BASE_URL }],
  creator: "Doify",
  publisher: "Doify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Doify",
    title: "Doify — Where teams move work forward",
    description:
      "Plan smarter, collaborate in real time, and ship work without the chaos.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Doify — Task Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doify — Where teams move work forward",
    description:
      "Plan smarter, collaborate in real time, and ship work without the chaos.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "9e1f13451108292f",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doify",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: BASE_URL,
  description:
    "Doify is a modern task management platform designed to help teams plan smarter, collaborate in real time, and ship work without the chaos.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Doify",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-doify.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://careerpatch.vercel.app" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <RootProviders>{children}</RootProviders>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}