"use client";

import { useEffect, useState } from "react";
import { SITE_LINKS } from "@/config/site-links";

type CloneSiteProps = {
  headerHtml: string;
  marqueeHtml: string;
  contentHtml: string;
  footerHtml: string;
  sideMenuHtml: string;
  floatHtml: string;
};

export function CloneSite(props: CloneSiteProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.className = "C ahw-before-login EN";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    const home = document.getElementById("home");
    if (home) home.style.visibility = "visible";

    document.querySelectorAll<HTMLAnchorElement>("a.login, a.register, a.register-btn").forEach((link) => {
      const isRegister = link.classList.contains("register") || link.classList.contains("register-btn");
      link.href = isRegister ? SITE_LINKS.register : SITE_LINKS.login;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.querySelectorAll<HTMLAnchorElement>('a[href="/login"], a[href="#login"]').forEach((link) => {
      link.href = SITE_LINKS.login;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest(".close-banner")) {
        const banner = document.querySelector(".download-banner") as HTMLElement | null;
        if (banner) banner.style.display = "none";
      }

      if (target.closest(".opensidemenu")) {
        document.getElementById("sideMenu")?.classList.add("open");
        document.getElementById("sideMenuOverlay")?.classList.add("open");
      }

      if (target.closest(".closesidemenu") || target.id === "sideMenuOverlay") {
        document.getElementById("sideMenu")?.classList.remove("open");
        document.getElementById("sideMenuOverlay")?.classList.remove("open");
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "#000" }} />;
  }

  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.headerHtml }} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.marqueeHtml }} />
      <div id="content" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.contentHtml }} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.footerHtml }} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.sideMenuHtml }} />
      <div id="sideMenuOverlay" />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: props.floatHtml }} />
    </>
  );
}
