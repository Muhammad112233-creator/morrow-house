import Link from "next/link";
import HomeReveals from "@/components/home-reveals";
import SiteHeader from "@/components/site-header";
import AboutCarousel from "@/components/about-carousel";
import HouseModel from "@/components/house-model";
import ResidenceStory from "@/components/residence-story";
import { assetPath } from "@/lib/assets";
import { rooms, siteContent } from "@/lib/content";

function ArrowMark({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m0 0-6.5-6.5M19 12l-6.5 6.5" /></svg>
  );
}

export default function HomePage() {
  return (
    <HomeReveals>
      <SiteHeader />
      <main id="main-content" className="home-page">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={assetPath("/images/hero-house.jpg")}
            alt="A pale limestone courtyard house in Lahore, opening onto a garden and still reflecting pool."
            fetchPriority="high"
          />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-topline">
            <span className="eyebrow hero-arrival">{siteContent.hero.eyebrow}</span>
            <span className="hero-coordinate hero-arrival">31° 32′ N&nbsp;&nbsp; 74° 21′ E</span>
          </div>

          <div className="hero-copy">
            <p className="hero-kicker hero-arrival">A place to return to yourself</p>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-line-mask"><span className="hero-title-line">{siteContent.hero.lineOne}</span></span>
              <span className="hero-line-mask"><em className="hero-title-line">{siteContent.hero.lineTwo}</em></span>
            </h1>
            <p className="hero-intro hero-arrival">{siteContent.hero.description}</p>
            <a className="hero-link hero-arrival" href="#marquee-transition" data-cursor="Explore">
              <span>Explore the house</span><span className="hero-link-icon"><ArrowMark /></span>
            </a>
          </div>

          <div className="hero-bottom hero-arrival">
            <div className="hero-project">
              <span className="hero-project-label">Featured residence</span>
              <span className="hero-project-name">The Courtyard House</span>
              <span className="hero-project-meta">{siteContent.location} <i>·</i> {siteContent.year}</span>
            </div>
            <p className="hero-bottom-note">A residential study<br />in inward living.</p>
            <a className="scroll-cue" href="#about" data-cursor="Scroll">
              <span>Scroll to enter</span><span className="scroll-cue-line" aria-hidden="true" />
            </a>
          </div>
          <span className="hero-corner-note" aria-hidden="true">01 / 04&nbsp;&nbsp; — &nbsp;&nbsp;FORM, LIGHT, HOME</span>
        </section>

        <section className="intro-section" id="about" aria-labelledby="intro-title">
          <div className="section-topline" data-reveal>
            <span className="eyebrow">01 / The idea</span>
            <span className="section-topline-note">A slower kind of architecture</span>
          </div>
          <div className="intro-layout">
            <h2 id="intro-title" className="intro-heading" data-reveal>
              A house can make<br />
              <em>room for quiet.</em>
            </h2>
            <div className="intro-aside" data-reveal>
              <p>
                Not by asking life to be still, but by giving it a softer place to land. The courtyard lets light, air and the small sounds of the garden move through every room.
              </p>
              <span className="intro-aside-signature">A home, considered from the inside out.</span>
            </div>
          </div>

          <AboutCarousel />

          <div className="principles-row" data-reveal>
            <div className="principle"><span>01</span><p>Shade, before spectacle</p></div>
            <div className="principle"><span>02</span><p>Materials with a memory</p></div>
            <div className="principle"><span>03</span><p>Space for ordinary days</p></div>
          </div>
        </section>

        <section className="study-section" id="marquee-transition" aria-labelledby="study-title">
          <div className="marquee-band" aria-hidden="true">
            <div className="marquee-track">
              {Array.from({ length: 6 }, (_, index) => <span key={index}>MORROW <i>/</i> HOUSE <b>✳</b></span>)}
            </div>
          </div>
          <div className="study-intro">
            <div className="section-topline" data-reveal>
              <span className="eyebrow">02 / The structure</span>
              <span className="section-topline-note">An interactive study in layers</span>
            </div>
            <div className="study-copy-row">
              <h2 id="study-title" data-reveal>A study in<br /><em>form, light</em><br />and proportion.</h2>
              <p data-reveal>
                A simple plan, held together by a garden at its centre. Turn the model, then set the walls, roof and openings aside to see how the house is put together.
              </p>
            </div>
          </div>
          <HouseModel />
          <div className="study-caption" data-reveal>
            <span>Courtyard House / Axonometric study</span>
            <span>Move through the structure <i>↗</i></span>
          </div>
        </section>

        <section className="story-section" id="residence-slides" aria-labelledby="story-heading">
          <div className="section-topline" data-reveal>
            <span className="eyebrow">03 / At home</span>
            <span className="section-topline-note">Two moments, one quiet rhythm</span>
          </div>
          <div className="story-section-heading" data-reveal>
            <h2 id="story-heading">The day moves<br /><em>through the house.</em></h2>
            <p>Openings are placed for more than a view. They make a small ceremony of changing light.</p>
          </div>
          <ResidenceStory />
        </section>

        <section className="interlude" aria-labelledby="interlude-title">
          <div className="interlude-cloud cloud-one" aria-hidden="true" />
          <div className="interlude-cloud cloud-two" aria-hidden="true" />
          <div className="interlude-inner" data-reveal>
            <span className="eyebrow">A note on scale</span>
            <h2 id="interlude-title">Not every space<br />needs to be <em>grand.</em></h2>
            <p>Sometimes the smallest pause is the one that stays with you.</p>
          </div>
          <span className="interlude-index" aria-hidden="true">M / H — 2026</span>
        </section>

        <section className="stay-section" id="residence-02" aria-labelledby="stay-title">
          <div className="section-topline" data-reveal>
            <span className="eyebrow">04 / The rooms</span>
            <span className="section-topline-note">A few favourite corners</span>
          </div>
          <div className="stay-heading-row">
            <div data-reveal>
              <span className="stay-pretitle">The Courtyard House</span>
              <h2 id="stay-title">A different way<br /><em>to stay.</em></h2>
            </div>
            <p data-reveal>
              A considered home for the everyday and the in-between. Warm materials, a little garden, and everything kept close at hand.
            </p>
          </div>
          <div className="room-grid">
            {rooms.map((room, index) => (
              <Link
                href="/tour/"
                key={room.number}
                className={`room-card room-card-${index + 1}`}
                data-cursor="Walk through"
                aria-label={`Walk through the house — ${room.title}`}
              >
                <div className="room-image-wrap">
                  <img src={assetPath(room.src)} alt={room.alt} loading="lazy" />
                  <span className="room-image-index">{room.number} <i>/ 03</i></span>
                  <span className="room-image-arrow"><ArrowMark diagonal /></span>
                </div>
                <div className="room-card-copy">
                  <div className="room-title-row"><h3>{room.title}</h3><span>{room.number}</span></div>
                  <p>{room.detail}</p>
                  <span className="room-note">{room.note}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="stay-footline" data-reveal>
            <span>Three rooms · A planted courtyard · One slower pace</span>
            <Link href="/tour/" data-cursor="Enter the house">Explore the residence <ArrowMark /></Link>
          </div>
        </section>

        <section className="tour-cta" id="residence-02-tour" aria-labelledby="tour-cta-title">
          <img
            className="tour-cta-image"
            src={assetPath("/images/evening-house.jpg")}
            alt="Warm light in the courtyard house as evening settles over the garden."
            loading="lazy"
          />
          <div className="tour-cta-shade" aria-hidden="true" />
          <div className="tour-cta-topline" data-reveal>
            <span className="eyebrow">A closer way to see it</span>
            <span>Interactive residence · 01</span>
          </div>
          <div className="tour-cta-copy" data-reveal>
            <span className="tour-cta-kicker">Leave the photograph behind</span>
            <h2 id="tour-cta-title">Step<br /><em>inside.</em></h2>
            <p>Move beyond the frame. Look around, find the quiet corners, and make your own way through the rooms.</p>
            <Link className="tour-enter-link" href="/tour/" data-cursor="Enter">
              <span>Enter the house</span><span className="tour-enter-arrow"><ArrowMark /></span>
            </Link>
          </div>
          <div className="tour-cta-bottom" data-reveal>
            <span>W A S D <i>Move</i></span>
            <span>E <i>Look closer</i></span>
            <span>Q <i>Change the light</i></span>
            <span className="tour-cta-scroll">Or simply drag to look around</span>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-topline" data-reveal>
          <span className="eyebrow">Morrow House · {siteContent.location}</span>
          <a href="#top" className="back-to-top" data-cursor="Top">Back to the beginning <span>↑</span></a>
        </div>
        <div className="footer-main">
          <div className="footer-headline-wrap" data-reveal>
            <span className="footer-overline">A home, considered.</span>
            <h2>Make room<br /><em>for living.</em></h2>
          </div>
          <div className="footer-details" data-reveal>
            <p className="footer-invitation">Have a place in mind?<br />We would love to hear about it.</p>
            <a className="footer-email" href={`mailto:${siteContent.email}`} data-cursor="Write to us">
              {siteContent.email}<ArrowMark diagonal />
            </a>
            <div className="footer-nav">
              <span className="eyebrow">Browse</span>
              <Link href="#marquee-transition">The house</Link>
              <Link href="#residence-slides">The details</Link>
              <Link href="#residence-02">The rooms</Link>
              <Link href="/tour/">Walk through</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottomline">
          <span>© {siteContent.year} Morrow House</span>
          <span>A fictional residential design study · Lahore, Pakistan</span>
          <span>Thoughtfully made, slowly lived.</span>
        </div>
      </footer>
    </HomeReveals>
  );
}
