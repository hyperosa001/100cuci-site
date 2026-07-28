import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./landing.css";
import { getStructuredDataGraph } from "@/config/structured-data";
import {
  SITE_DESCRIPTION,
  SITE_FAVICON_PATH,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_PAGE_TITLE,
  SITE_URL,
} from "@/config/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_PAGE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/",
    languages: {
      "en-MY": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_PAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_FAVICON_PATH, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_PAGE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_FAVICON_PATH],
  },
  icons: {
    icon: SITE_FAVICON_PATH,
    apple: SITE_FAVICON_PATH,
  },
  appleWebApp: {
    capable: true,
    title: "100Cuci - Wallet",
    statusBarStyle: "black-translucent",
  },
  other: {
    title: "100CUCI | Slot Free Credit No Deposit New Member 2026",
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "auto" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredDataGraph()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
