import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileRegisterBar, SiteFooter } from "@/components/ArticleContent";
import { SITE_LINKS } from "@/config/site-links";
import { getAllCategories } from "@/lib/content";
import {
  SEO_FAQ,
  SEO_KEYWORD_LINK_HEAD,
  SEO_KEYWORD_LINK_TAIL,
  SEO_LAST_UPDATED,
  SEO_SECTIONS,
} from "@/content/seo-content";

const REGISTER = SITE_LINKS.register;

const HOT_GAMES = [
  "/media/0eae92f8764a601b27c2e.png",
  "/media/62f867f8764a68724ee87.png",
  "/media/e22f2ef8764a6d3b0a117.png",
  "/media/cf8789d8764a6e04830fa.png",
  "/media/675f046b521960cbf355d.png",
  "/media/68307716f769627cd0efd.png",
  "/media/b1ebdc6b521963aa4ff72.png",
  "/media/9042727b52196a5bc5d90.png",
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

function SeoKeywordLink({
  link,
}: {
  link: { text: string; href: string; external?: boolean };
}) {
  if (link.external) {
    return (
      <a href={link.href} className="lp-keyword-link" target="_blank" rel="noopener noreferrer">
        {link.text}
      </a>
    );
  }
  return (
    <Link href={link.href} className="lp-keyword-link">
      {link.text}
    </Link>
  );
}

export function LandingPage() {
  const categories = getAllCategories();

  return (
    <div className="landing">
      <SiteHeader />

      <div className="lp-marquee">
        <span>
          100CUCI | Minimum Deposit RM1 | Free Credit No Deposit | New Member RM5 Free | 24 Hours Service | Safe &amp; Fast Withdrawal | JILI · MEGA888 · PRAGMATIC PLAY ·&nbsp;
          100CUCI | Minimum Deposit RM1 | Free Credit No Deposit | New Member RM5 Free | 24 Hours Service | Safe &amp; Fast Withdrawal | JILI · MEGA888 · PRAGMATIC PLAY ·&nbsp;
        </span>
      </div>

      <section className="lp-hero">
        <div className="lp-hero-banner">
          <img src="/media/b0dc9b63d88967e6859cb.webp" alt="100CUCI Welcome Bonus" />
        </div>
        <h1>100CUCI | Free Credit No Deposit New Member Malaysia</h1>
        <p className="lp-hero-sub">
          Malaysia&apos;s trusted online casino platform. Register now to claim your free credit and start playing top slot games instantly.
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

      <section className="lp-section">
        <img src="/media/1ab4589f3219601fbb7cd.png" alt="Payment methods" style={{ width: "100%", borderRadius: 12 }} />
      </section>

      <section className="lp-section lp-categories">
        <h2 className="lp-section-title">Explore 100CUCI</h2>
        <div className="lp-category-grid">
          {categories.map((category) => (
            <Link key={category.slug} href={`/articles/${category.slug}`} className="lp-category-card">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <span>{category.articles.length} articles →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-section-title">
          <img src="/media/a633e1ae197967554ac5e.webp" alt="" />
          HOT GAMES — Register to Play
        </h2>
        <div className="lp-games">
          {HOT_GAMES.map((src) => (
            <RegisterLink key={src} className="lp-game-card">
              <img src={src} alt="Hot game" />
            </RegisterLink>
          ))}
        </div>
        <div className="lp-section-cta">
          <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
            REGISTER TO PLAY ALL GAMES
          </RegisterLink>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-promo">
          <img src="/media/f85eb31f3219680b10ca3.gif" alt="10% Weekly Commission" />
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
            <p>New members receive RM5 free credit instantly after registration — no deposit required to start playing.</p>
          </div>
          <div className="lp-feature">
            <h3>30+ Game Providers</h3>
            <p>Play JILI, MEGA888, Pragmatic Play, PG Soft, Evolution and more — all accessible after you register.</p>
          </div>
          <div className="lp-feature">
            <h3>Safe &amp; Fast Withdrawal</h3>
            <p>Bank-grade SSL encryption. Withdraw via Touch n Go, GrabPay, FPX within 15–30 minutes.</p>
          </div>
        </div>
      </section>

      <div className="lp-cta-bar">
        <RegisterLink className="lp-btn lp-btn-register lp-btn-lg">
          CREATE ACCOUNT &amp; START PLAYING
        </RegisterLink>
        <p className="lp-cta-note">
          Already a member?{" "}
          <a href={SITE_LINKS.login} target="_blank" rel="noopener noreferrer" className="lp-cta-link">
            Log in here
          </a>
        </p>
      </div>

      <section className="lp-seo">
        <div className="lp-seo-inner">
          <p className="lp-seo-updated">Last updated: {SEO_LAST_UPDATED}</p>

          <p className="lp-seo-keylink-line">
            <SeoKeywordLink link={SEO_KEYWORD_LINK_HEAD} />
          </p>

          {SEO_SECTIONS.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          <h2>FAQ</h2>
          {SEO_FAQ.map((item) => (
            <div key={item.q} className="lp-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}

          <p className="lp-seo-keylink-line lp-seo-keylink-tail">
            <SeoKeywordLink link={SEO_KEYWORD_LINK_TAIL} />
          </p>

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
            <RegisterLink className="lp-btn lp-btn-register">REGISTER NOW</RegisterLink>
          </p>
        }
      />

      <MobileRegisterBar />
    </div>
  );
}
