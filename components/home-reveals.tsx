"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomeReveals({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reduced) {
        gsap.set(revealItems, { clearProps: "all" });
        return;
      }

      revealItems.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            delay: Math.min(index % 3, 2) * 0.06,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: element,
              start: "top 91%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: image.parentElement || image,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          },
        );
      });

      const heroLines = gsap.utils.toArray<HTMLElement>(".hero-title-line");
      gsap.fromTo(
        heroLines,
        { yPercent: 115, rotate: 1.5, autoAlpha: 0 },
        {
          yPercent: 0,
          rotate: 0,
          autoAlpha: 1,
          duration: 1.35,
          stagger: 0.13,
          delay: 0.22,
          ease: "power4.out",
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        ".hero-arrival",
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.09, delay: 0.75, ease: "power3.out" },
      );
    },
    { scope },
  );

  return <div ref={scope} className="page-motion">{children}</div>;
}
