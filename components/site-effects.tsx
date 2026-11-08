"use client";

import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    if (!cursor) return;

    const html = document.documentElement;
    const hide = () => {
      cursor.classList.remove("is-visible", "is-active", "is-pressed");
      html.classList.remove("has-custom-cursor");
    };
    const onMove = (event: PointerEvent) => {
      // Touch has no persistent pointer. Keep the native touch experience untouched.
      if (event.pointerType === "touch") {
        hide();
        return;
      }
      html.classList.add("has-custom-cursor");
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("is-visible");
    };
    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const text = target?.dataset.cursor || "";
      cursor.dataset.label = text;
      cursor.classList.toggle("is-active", Boolean(text));
    };
    const onOut = (event: PointerEvent) => {
      const from = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const to = (event.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (from && !to) {
        cursor.dataset.label = "";
        cursor.classList.remove("is-active");
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") cursor.classList.add("is-pressed");
    };
    const onUp = () => cursor.classList.remove("is-pressed");

    document.addEventListener("pointermove", onMove, { passive: true, capture: true });
    document.addEventListener("pointerover", onOver, { passive: true, capture: true });
    document.addEventListener("pointerout", onOut, { passive: true, capture: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("mouseleave", hide);
    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", hide);
      window.removeEventListener("mouseleave", hide);
      html.classList.remove("has-custom-cursor");
    };
  }, []);

  return <div className="custom-cursor" aria-hidden="true" data-label="" />;
}

export default function SiteEffects({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    const onLenisScroll = () => ScrollTrigger.update();
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -18 });
      history.replaceState(null, "", href);
    };

    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", onAnchorClick);
    window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <CustomCursor />
      {children}
    </>
  );
}
