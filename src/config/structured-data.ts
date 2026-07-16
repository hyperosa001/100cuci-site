import {
  SITE_META_TITLE,
  SITE_NAME,
  SITE_ORG_LOGO_PATH,
  SITE_URL,
} from "@/config/site";

/** Matches 100cuci.com JSON-LD @graph, with URLs pointed at this site. */
export function getStructuredDataGraph() {
  const orgLogoUrl = new URL(SITE_ORG_LOGO_PATH, SITE_URL).href;
  const orgId = `${SITE_URL}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": orgId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: orgLogoUrl,
        },
        image: orgLogoUrl,
        description:
          "Claim free credit RM100 no deposit at 100Cuci Malaysia. Updated 2026 list of RM100 bonuses, slot free credit & instant withdrawal casinos.",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Suite 18-08, Menara MBMR No. 1, Jalan Syed Putra, Mid Valley City",
          addressLocality: "Kuala Lumpur",
          addressRegion: "Wilayah Persekutuan",
          postalCode: "59200",
          addressCountry: "MY",
        },
        telephone: "+603-2201-7788",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        sameAs: [
          "https://100cuci.com/",
          "https://100cuci.ad/",
          "https://cuci100.co/",
          "https://cuci100.net/",
          "https://cuci100.com/",
          "https://100cucilogin.com/",
          "https://100cuci.world/",
          "https://100cuci.site/",
          "https://100cuci.shop/",
          "https://100cuci.pro/",
          "https://100cuci.me/",
          "https://100cuci.life/",
          "https://heylink.me/100cuci.com/",
          "https://telegram.me/Official_100cuci",
        ],
      },
      {
        "@type": "Article",
        "@id": `${SITE_URL}/#article`,
        headline: SITE_META_TITLE,
        description:
          "Get slot free credit no deposit for new members starting from RM5 to RM100 at 100CUCI. Enjoy slot games with trusted deposit, and withdrawals. 18+ only",
        url: `${SITE_URL}/`,
        image: orgLogoUrl,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          "@id": orgId,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          "@id": orgId,
        },
        inLanguage: "en-MY",
        datePublished: "2026-04-14",
        dateModified: "2026-04-14",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/`,
        },
        keywords: [
          "free credit no deposit",
          "free credit no deposit new member",
          "slot free credit no deposit",
          "free credit rm100 no deposit",
          "slot free credit rm100",
          "malaysia online casino",
          "online casino malaysia",
        ],
      },
      {
        "@type": "Review",
        "@id": `${SITE_URL}/#review`,
        name: "Joy.link Free Credit No Deposit RM100 at 100CUCI - Player Review",
        reviewBody:
          "100CUCI offers one of the most straightforward Joylink free credit no deposit promotions in Malaysia. The claim process is simple, the game selection is wide, and withdrawals are processed quickly. The platform supports multiple slot providers including Pragmatic Play, Spadegaming, and CQ9, all accessible with a single account. Customer support is available 24/7 in both English and Bahasa Malaysia, making it a reliable choice for Malaysian players at all experience levels.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4.8",
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Organization",
          name: "100CUCI Editorial Team",
        },
        itemReviewed: {
          "@type": "LocalBusiness",
          name: "Joylink Free Credit No Deposit - 100CUCI",
          url: `${SITE_URL}/`,
          image: orgLogoUrl,
          brand: {
            "@type": "Brand",
            name: SITE_NAME,
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is 100CUCI a trusted Malaysia online casino platform?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. 100CUCI is certified by iTech Labs and TST for game fairness, secured by GoDaddy with full SSL encryption, and protected by iovation enterprise fraud detection. The platform supports all major Malaysian payment methods including FPX, Touch 'n Go, GrabPay, and direct bank transfer.",
            },
          },
          {
            "@type": "Question",
            name: "How do I claim the free credit no deposit bonus on 100CUCI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Register a new account, verify your phone number, and navigate to the Promotion page. Click Claim on the New Register Free RM5 tile and the credit is added instantly. You can also claim Free Credit 365 Hari RM3 every day to stack additional no-deposit credit.",
            },
          },
          {
            "@type": "Question",
            name: "Does 100CUCI offer free credit 365 hari for daily claim?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Free Credit 365 Hari is one of our flagship daily promotions. Active members can claim RM3 free credit every single day, with no deposit required. Over a week of consistent claims, that builds to RM21 in pure no-deposit playable credit.",
            },
          },
          {
            "@type": "Question",
            name: "Is free credit no deposit really free at 100CUCI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. 100CUCI's free credit no deposit rewards do not require any deposit, IC upload, or hidden conditions. Standard turnover applies on bonus winnings before withdrawal, which is industry-standard practice to prevent bonus abuse.",
            },
          },
          {
            "@type": "Question",
            name: "What deposit and withdrawal methods does 100CUCI support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "100CUCI supports FPX (all major Malaysian banks including Maybank, CIMB, Public Bank, RHB), MEPS, Touch 'n Go eWallet, GrabPay, MAE, Boost, Digi, and CelcomDigi telco pin reloads. Withdrawals are processed within minutes via your registered payment method.",
            },
          },
          {
            "@type": "Question",
            name: "Can I play Mega888, 918Kiss, and Pussy888 with 100CUCI's free credit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Free credit on 100CUCI works across all major slot Malaysia providers including Mega888, 918Kiss, Pussy888, JILI, Pragmatic Play, and PG Soft. Note that free credit is restricted to slot games, not live casino or fishing games.",
            },
          },
        ],
      },
    ],
  };
}
