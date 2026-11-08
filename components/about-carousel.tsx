"use client";

import { useState } from "react";
import { gallerySlides } from "@/lib/content";
import { assetPath } from "@/lib/assets";

export default function AboutCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallerySlides[activeIndex];
  const step = (direction: number) => {
    setActiveIndex((current) => (current + direction + gallerySlides.length) % gallerySlides.length);
  };

  return (
    <div className="about-gallery" aria-label="A sequence of spaces in the house">
      <div className="gallery-images" aria-live="polite">
        {gallerySlides.map((slide, index) => (
          <img
            key={slide.src}
            className={`gallery-image ${index === activeIndex ? "is-active" : ""}`}
            src={assetPath(slide.src)}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            aria-hidden={index !== activeIndex}
          />
        ))}
      </div>
      <div className="gallery-shade" aria-hidden="true" />
      <div className="gallery-topline">
        <span className="gallery-tag">A closer look</span>
        <span className="gallery-count">0{activeIndex + 1} <i>/</i> 0{gallerySlides.length}</span>
      </div>
      <div className="gallery-bottomline">
        <p className="gallery-caption" key={active.label}>{active.label}</p>
        <div className="gallery-controls">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Show previous photograph"
            data-cursor="Previous"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6.5-6.5M5 12l6.5 6.5" /></svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Show next photograph"
            data-cursor="Next"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m0 0-6.5-6.5M19 12l-6.5 6.5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
