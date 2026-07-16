import type { Metadata } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "100CUCI | Slot Free Credit No Deposit New Member Malaysia",
  description: SITE_DESCRIPTION,
  keywords: [
    "100CUCI",
    "free credit no deposit",
    "slot Malaysia",
    "online casino Malaysia",
    "new member bonus",
    "free kredit slot",
  ],
  alternates: {
    canonical: "/",
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
    title: "100CUCI | Slot Free Credit No Deposit New Member Malaysia",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/media/f5e0ed4082196f7432355.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "100CUCI | Slot Free Credit No Deposit New Member Malaysia",
    description: SITE_DESCRIPTION,
    images: ["/media/f5e0ed4082196f7432355.png"],
  },
  icons: {
    icon: "/media/f5e0ed4082196f7432355.png",
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
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/clone/clone.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        {googleVerification ? (
          <meta name="google-site-verification" content={googleVerification} />
        ) : null}
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "auto" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "en-MY",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
