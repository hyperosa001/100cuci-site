import Link from "next/link";
import { SITE_LINKS } from "@/config/site-links";
import { MAIN_NAV } from "@/config/navigation";

export function SiteHeader() {
  return (
    <>
      <header className="lp-header">
        <Link href="/">
          <img className="logo" src="/media/d6838063072a67b0cddf5.gif" alt="100CUCI" />
        </Link>
        <div className="lp-header-actions">
          <a href={SITE_LINKS.login} className="lp-btn lp-btn-login" target="_blank" rel="noopener noreferrer">
            LOGIN
          </a>
          <a href={SITE_LINKS.register} className="lp-btn lp-btn-register" target="_blank" rel="noopener noreferrer">
            REGISTER
          </a>
        </div>
      </header>

      <nav className="lp-nav" aria-label="Site sections">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="lp-nav-item">
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
