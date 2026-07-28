import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileRegisterBar, SiteFooter } from "@/components/ArticleContent";
import { CATEGORY_COVERS } from "@/config/article-covers";
import { SITE_LINKS } from "@/config/site-links";
import type { Category } from "@/content/types";
import {
  SEO_CUCI_LINK_EXTERNAL,
  SEO_CUCI_LINK_HREF,
  SEO_FAQ,
  SEO_LAST_UPDATED,
  SEO_SECTIONS,
} from "@/content/seo-content";
import {
  HomepageSeoText,
  collectHomepageSeoTexts,
  count100CuciMatches,
} from "@/lib/homepage-seo-links";

const REGISTER = SITE_LINKS.register;

/** Origin CDN portrait game thumbs — marquee like 100cuci.com Hot Games */
const HOT_GAMES = [
  {
    src: "/media/e7a9b547005a602d5804f.png",
    name: "Tai Chi",
    provider: "VertexPlay",
    rtp: "98.80",
  },
  {
    src: "/media/0eae92f8764a601b27c2e.png",
    name: "Muscle Fortune Cat",
    provider: "JILI",
    rtp: "97.50",
  },
  {
    src: "/media/62f867f8764a68724ee87.png",
    name: "DJ Boom Boom",
    provider: "JILI",
    rtp: "97.20",
  },
  {
    src: "/media/e22f2ef8764a6d3b0a117.png",
    name: "Super Elements 2",
    provider: "Fastspin",
    rtp: "97.10",
  },
  {
    src: "/media/ee03e5d7764a66d4b2da0.png",
    name: "100 CUCI Super Gems",
    provider: "Playstar",
    rtp: "98.21",
  },
  {
    src: "/media/e62a46a7764a6b7535127.png",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    rtp: "96.50",
  },
  {
    src: "/media/6d1e31c7764a63937268b.png",
    name: "Golden Empire",
    provider: "JILI",
    rtp: "96.91",
  },
  {
    src: "/media/1a0946b7764a6362c5d12.png",
    name: "Safari Mystery",
    provider: "JILI",
    rtp: "97.88",
  },
  {
    src: "/media/dd267538764a6356b6583.png",
    name: "100 CUCI Rage T-Rex 2",
    provider: "VPlus",
    rtp: "97.34",
  },
  {
    src: "/media/ba1b4f97764a68084359f.png",
    name: "Monkey King Rush",
    provider: "Pragmatic Play",
    rtp: "97.09",
  },
  {
    src: "/media/c713dca7764a60edc131a.png",
    name: "The Myth Wukong",
    provider: "Meta Gaming",
    rtp: "97.65",
  },
  {
    src: "/media/f01511fb45d9650f4c841.png",
    name: "Fastspin Slot",
    provider: "Fastspin",
    rtp: "96.80",
  },
];

const STEPS = [
  "Register & verify OTP",
  "Claim free credit no deposit",
  "Play eligible games",
  "Withdraw via e-wallet / FPX",
];

function RegisterLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={REGISTER}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function LandingPage({ categories }: { categories: Category[] }) {
  const seoLinkState = { seen: 0 };
  const seoTexts = collectHomepageSeoTexts(SEO_SECTIONS, SEO_FAQ);
  const total100Cuci = count100CuciMatches(seoTexts);
  const seoLinkProps = {
    href: SEO_CUCI_LINK_HREF,
    external: SEO_CUCI_LINK_EXTERNAL,
    state: seoLinkState,
    totalMatches: total100Cuci,
  };

  return (
    <div className="landing">
      <SiteHeader />

      <div className="lp-marquee">
        <span>
          100CUCI | Minimum Deposit RM1 | Free Credit No Deposit | New Member RM5
          Free | 24 Hours Service | Safe &amp; Fast Withdrawal | JILI · MEGA888 ·
          PRAGMATIC PLAY ·&nbsp; 100CUCI | Minimum Deposit RM1 | Free Credit No
          Deposit | New Member RM5 Free | 24 Hours Service | Safe &amp; Fast
          Withdrawal | JILI · MEGA888 · PRAGMATIC PLAY ·&nbsp;
        </span>
      </div>

      <section className="lp-hero">
        <div className="lp-hero-banner">
          <img
            src="/media/b0dc9b63d88967e6859cb.webp"
            alt="100CUCI Syarikat Cuci welcome — free credit no deposit for new members"
          />
        </div>
        <h1>100CUCI | Free Credit No Deposit New Member Malaysia</h1>
        <p className="lp-hero-sub">
          Online casino Malaysia play with local banking, slot free credit
          campaigns when live, and a clear Register → claim → withdraw path.
        </p>
        <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
          REGISTER NOW — PLAY FREE
        </RegisterLink>
      </section>

      <div className="lp-trust">
        <div className="lp-trust-item">
          <strong>RM1</strong>
          Min Deposit
        </div>
        <div className="lp-trust-item">
          <strong>RM5</strong>
          Free Register Bonus
        </div>
        <div className="lp-trust-item">
          <strong>24/7</strong>
          Live Support
        </div>
        <div className="lp-trust-item">
          <strong>15 Min</strong>
          Fast Withdrawal
        </div>
      </div>

      <section className="lp-section lp-home-pay">
        <h2 className="lp-section-title">Malaysian Banking Rails</h2>
        <img
          className="lp-home-banner"
          src="/media/5165631054b96399427ff.png"
          alt="100CUCI accepts Malaysia banks, e-wallets, FPX and more"
        />
        <img
          className="lp-home-banner lp-home-banner-strip"
          src="/media/1ab4589f3219601fbb7cd.png"
          alt="Safe and fast withdrawal — we accept most payment methods"
        />
      </section>

      <section className="lp-section lp-categories">
        <h2 className="lp-section-title">Explore 100CUCI Guides</h2>
        <div className="lp-category-grid">
          {categories.map((category) => {
            const cover = CATEGORY_COVERS[category.slug];
            return (
              <Link
                key={category.slug}
                href={`/articles/${category.slug}`}
                className="lp-category-card"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    className="lp-category-card-cover"
                  />
                ) : null}
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <span>
                  {category.articles.length} articles · Read More →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="lp-section lp-hot-games">
        <h2 className="lp-section-title">
          <img src="/media/a633e1ae197967554ac5e.webp" alt="" />
          HOT GAMES — Register to Play
        </h2>
        <div className="lp-games-marquee" aria-label="Hot games marquee">
          <div className="lp-games-track">
            {[...HOT_GAMES, ...HOT_GAMES].map((game, index) => (
              <RegisterLink
                key={`${game.src}-${index}`}
                className="lp-game-card"
              >
                <img src={game.src} alt={game.name} />
                <span className="lp-game-name">{game.name}</span>
                <span className="lp-game-meta">
                  <span className="lp-game-provider">{game.provider}</span>
                  <span className="lp-game-rtp">RTP {game.rtp}</span>
                </span>
              </RegisterLink>
            ))}
          </div>
        </div>
        <div className="lp-section-cta">
          <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
            REGISTER TO PLAY ALL GAMES
          </RegisterLink>
        </div>
      </section>

      <section className="lp-section lp-home-steps">
        <h2 className="lp-section-title">Start in Four Steps</h2>
        <ol className="lp-steps">
          {STEPS.map((step, index) => (
            <li key={step}>
              <span className="lp-step-num">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-section">
        <div className="lp-promo">
          <img
            src="/media/f85eb31f3219680b10ca3.gif"
            alt="100CUCI weekly commission and ongoing rewards"
          />
        </div>
        <RegisterLink className="lp-btn lp-btn-register lp-btn-lg lp-promo-btn">
          REGISTER &amp; GET COMMISSION
        </RegisterLink>
      </section>

      <section className="lp-section">
        <h2 className="lp-section-title">Why Choose 100CUCI?</h2>
        <div className="lp-features">
          <div className="lp-feature">
            <h3>Free Credit No Deposit</h3>
            <p>
              New members can claim a small welcome credit after Register and OTP
              when the campaign is live — use it to learn the lobby first.
            </p>
          </div>
          <div className="lp-feature">
            <h3>30+ Game Providers</h3>
            <p>
              Slots, live casino, sportsbook and more — JILI, MEGA888-style
              rooms, Pragmatic Play, PG Soft and other studios when listed.
            </p>
          </div>
          <div className="lp-feature">
            <h3>Safe &amp; Fast Withdrawal</h3>
            <p>
              Local rails such as Touch n Go, GrabPay and FPX. Many payouts
              finish in roughly 15–30 minutes after eligible turnover clears.
            </p>
          </div>
        </div>
      </section>

      <div className="lp-cta-bar">
        <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
          CREATE ACCOUNT &amp; START PLAYING
        </RegisterLink>
        <p className="lp-cta-note">
          Already a member?{" "}
          <a
            href={SITE_LINKS.login}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-cta-link"
          >
            Log in here
          </a>
        </p>
      </div>

      <section className="lp-seo">
        <div className="lp-seo-inner">
          <p className="lp-seo-updated">Last updated: {SEO_LAST_UPDATED}</p>

          {SEO_SECTIONS.map((section) => (
            <article key={section.title}>
              <h2>
                <HomepageSeoText text={section.title} {...seoLinkProps} />
              </h2>
              {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 48)}>
                  <HomepageSeoText text={p} {...seoLinkProps} />
                </p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item.slice(0, 48)}>
                      <HomepageSeoText text={item} {...seoLinkProps} />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          <h2>FAQ</h2>
          {SEO_FAQ.map((item) => (
            <div key={item.q} className="lp-faq-item">
              <h3>
                <HomepageSeoText text={item.q} {...seoLinkProps} />
              </h3>
              <p>
                <HomepageSeoText text={item.a} {...seoLinkProps} />
              </p>
            </div>
          ))}

          <div className="lp-seo-final-cta">
            <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
              REGISTER NOW — CLAIM FREE RM5
            </RegisterLink>
          </div>
        </div>
      </section>

      <SiteFooter
        cta={
          <p className="lp-footer-cta">
            <RegisterLink className="lp-btn lp-btn-register">
              REGISTER NOW
            </RegisterLink>
          </p>
        }
      />

      <MobileRegisterBar />
    </div>
  );
}
