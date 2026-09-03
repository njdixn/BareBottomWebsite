import React from 'react';
import { useSpecials } from '../../hooks/useSpecials';

export default function SpecialsSection({ title = "Current specials.", subtitle = "Seasonal offers and limited-time deals." }) {
  const { specials, loading } = useSpecials(true);

  if (loading) {
    return null;
  }

  if (!specials || specials.length === 0) {
    return null;
  }

  return (
    <div className="section" id="specialsSection">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Limited time</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
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
    </div>
  );
}

