"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_LINKS } from "@/config/site-links";
import { MAIN_NAV } from "@/config/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className="lp-header">
        <Link href="/" className="lp-logo-link">
          <img
            className="logo"
            src="/media/f44bef109d896efe53f88.gif"
            alt="100CUCI"
          />
        </Link>
        <div className="lp-header-actions">
          <a
            href={SITE_LINKS.login}
            className="lp-header-btn lp-header-btn-login"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Login"
          >
            <span className="lp-header-btn-label">Login</span>
          </a>
          <a
            href={SITE_LINKS.register}
            className="lp-header-btn lp-header-btn-register"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register"
          >
            <span className="lp-header-btn-label">Register</span>
          </a>
        </div>
      </header>

      <nav className="lp-nav" aria-label="Site sections">
        {MAIN_NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "lp-nav-item is-active" : "lp-nav-item"}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
