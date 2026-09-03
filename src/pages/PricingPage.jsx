import React, { useEffect } from 'react';
import { usePricing } from '../hooks/usePricing';
import { useSpecials } from '../hooks/useSpecials';
import PricingCard from '../components/pricing/PricingCard';

export default function PricingPage() {
  const { plans, loading: plansLoading, error: plansError } = usePricing();
  const { specials, loading: specialsLoading } = useSpecials(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const visiblePlans = plans.filter((plan) => plan.active !== false);

  return (
    <div className="pricing-page">
      {/* Active specials if available with compact top spacing */}
      {!specialsLoading && specials && specials.length > 0 && (
        <section className="section" style={{ background: 'var(--white)', padding: '24px 0 20px' }}>
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: '16px' }}>
              <span className="eyebrow">Limited time</span>
              <h2>Current specials.</h2>
              <p>Seasonal offers and limited-time deals — updated regularly.</p>
            </div>
            <div className="specials-grid">
              {specials.map((s) => (
                <div className="special-card" key={s.id}>
                  <span className="special-tag">SPECIAL</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main pricing plans section */}
      <section className="section pricing-section" id="pricing">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Membership plans</span>
            <h2>Pick a plan, we take it from there.</h2>
            <p>Transparent rates with no hidden chemical charges or surprise fees.</p>
          </div>

          {plansLoading ? (
            <div className="pricing-grid">
              <p style={{ color: '#a9c9c6', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.85rem' }}>
                Loading plans…
              </p>
            </div>
          ) : plansError ? (
            <p style={{ color: '#ffb8b8', fontSize: '.9rem' }}>
              Pricing is temporarily unavailable — please call (509) 201-3467 for current rates.
            </p>
          ) : visiblePlans.length === 0 ? (
            <p style={{ color: '#a9c9c6', fontSize: '.9rem' }}>
              No pricing plans currently published. Please check back soon or call us.
            </p>
          ) : (
            <div className="pricing-grid">
              {visiblePlans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
