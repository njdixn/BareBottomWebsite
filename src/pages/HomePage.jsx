import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import SpecialsSection from '../components/home/SpecialsSection';
import QuoteForm from '../components/forms/QuoteForm';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#quote') {
      const quoteEl = document.getElementById('quote');
      if (quoteEl) {
        setTimeout(() => {
          quoteEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  return (
    <div className="home-view">
      <HeroSection />

      <SpecialsSection
        title="Current specials."
        subtitle="Seasonal offers and limited-time deals."
      />

      <section className="section" id="quote">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Get a free quote</span>
            <h2>Request a free quote.</h2>
            <p>Tell us a little bit about your pool or spa, and we'll send a customized quote.</p>
          </div>

          <QuoteForm />
        </div>
      </section>
    </div>
  );
}

