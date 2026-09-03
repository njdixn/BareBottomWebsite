import React from 'react';
import { Link } from 'react-router-dom';
import ClaritySlider from '../common/ClaritySlider';

export default function HeroSection() {
  const scrollToQuote = (e) => {
    const quoteEl = document.getElementById('quote');
    if (quoteEl) {
      e.preventDefault();
      quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero">
      <div className="wrap">
        <div>
          <span className="eyebrow" style={{ color: 'var(--aqua)' }}>
            POOL AND SPA SERVICES · CENTRAL WASHINGTON
          </span>
          <div>
            <img
              src="/images/full-logo.png"
              alt="Bare Bottom Pool and Spa logo"
              className="full-logo"
            />
          </div>
          <p className="lead">
            Enjoy perfectly balanced pool and hot tub water without all the hassle.
          </p>
          <p className="lead" style={{ marginTop: '4px', fontWeight: 500 }}>
            11 yrs servicing pools and spas · Licensed & Certified
          </p>

          <div className="hero-ctas">
            <a href="#quote" className="btn-primary" onClick={scrollToQuote}>
              Get My Free Quote
            </a>
            <Link to="/services" className="btn-ghost">
              View Our Services
            </Link>
          </div>
        </div>

        <div>
          <ClaritySlider />
        </div>
      </div>

      <svg
        className="wave"
        viewBox="0 0 1440 74"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,72 1440,28 L1440,74 L0,74 Z"
          fill="var(--white)"
        />
      </svg>
    </div>
  );
}

