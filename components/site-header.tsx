"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/lib/content";

type SiteHeaderProps = {
  variant?: "home" | "tour";
};

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(variant === "home");
  const homePath = variant === "tour" ? "/" : "";

  useEffect(() => {
    if (variant !== "home") return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0.16 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [variant]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-is-open");
    };
  }, [menuOpen]);

  const target = (id: string) => `${homePath}#${id}`;
  const close = () => setMenuOpen(false);
  const tone = variant === "tour" || !overHero ? "header-dark" : "header-light";

  return (
    <>
      <header className={`site-header ${tone}`}>
        <Link
          href={variant === "tour" ? "/" : "#top"}
          className="brand-lockup"
          aria-label="Morrow House, back to the beginning"
          onClick={close}
        >
          <span className="brand-symbol" aria-hidden="true">M</span>
          <span>{siteContent.brand}</span>
        </Link>

        <div className="header-actions">
          <a className="header-contact" href={`mailto:${siteContent.email}`}>
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
          <button
            className={`menu-trigger ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((value) => !value)}
            data-cursor={menuOpen ? "Close" : "Menu"}
          >
            <span className="menu-trigger-text">{menuOpen ? "CLOSE" : "MENU"}</span>
            <span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        className={`site-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="menu-inner">
          <div className="menu-topline">
            <span className="eyebrow">Morrow House · Lahore · 2026</span>
            <span className="menu-index">A study in considered living</span>
          </div>
          <nav className="menu-links" aria-label="Main navigation">
            <Link href={target("marquee-transition")} onClick={close} data-cursor="Explore">
              <span className="menu-number">01</span> The house <span className="menu-arrow">↗</span>
            </Link>
            <Link href={target("residence-slides")} onClick={close} data-cursor="Discover">
              <span className="menu-number">02</span> The details <span className="menu-arrow">↗</span>
            </Link>
            <Link href={target("residence-02")} onClick={close} data-cursor="Stay">
              <span className="menu-number">03</span> The rooms <span className="menu-arrow">↗</span>
            </Link>
            <Link href="/tour/" onClick={close} data-cursor="Enter">
              <span className="menu-number">04</span> Walk through <span className="menu-arrow">↗</span>
            </Link>
          </nav>
          <div className="menu-bottomline">
            <span>Quietly made for everyday life.</span>
            <a href={`mailto:${siteContent.email}`} onClick={close}>
              {siteContent.email} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
