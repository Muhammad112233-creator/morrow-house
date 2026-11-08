"use client";

import { useState } from "react";
import { storySlides } from "@/lib/content";
import { assetPath } from "@/lib/assets";

export default function ResidenceStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = storySlides[activeIndex];
  const step = (direction: number) => {
    setActiveIndex((current) => (current + direction + storySlides.length) % storySlides.length);
  };

  return (
    <div className="story-stage">
      <div className="story-photo" aria-live="polite">
        {storySlides.map((slide, index) => (
          <img
            key={slide.src}
            className={`story-image ${index === activeIndex ? "is-active" : ""}`}
            src={assetPath(slide.src)}
            alt={slide.alt}
            loading="lazy"
            aria-hidden={index !== activeIndex}
          />
        ))}
        <span className="story-image-label">Morrow House · {active.eyebrow.split(" / ")[1]}</span>
      </div>

      <div className="story-copy" aria-live="polite">
        <div className="story-copy-top">
          <span className="eyebrow">{active.eyebrow}</span>
          <span className="story-count">0{activeIndex + 1} <i>/</i> 0{storySlides.length}</span>
        </div>
        <h3 key={active.title}>{active.title}</h3>
        <p className="story-body" key={active.body}>{active.body}</p>
        <p className="story-note">{active.note}</p>
        <div className="story-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous house study" data-cursor="Previous">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6.5-6.5M5 12l6.5 6.5" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next house study" data-cursor="Next">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m0 0-6.5-6.5M19 12l-6.5 6.5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
