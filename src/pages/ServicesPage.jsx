import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: '〰️',
    title: 'Skim & Vacuum',
    desc: 'Surface debris cleared and floor vacuumed every visit.'
  },
  {
    icon: '🧪',
    title: 'Chemical Balancing',
    desc: 'pH, chlorine, and alkalinity tested and adjusted on-site.'
  },
  {
    icon: '🧽',
    title: 'Tile & Surface Brushing',
    desc: 'Waterline and walls brushed to stop buildup before it starts.'
  },
  {
    icon: '⚙️',
    title: 'Filter & Equipment Check',
    desc: 'Filters cleaned, pumps and heaters inspected for early issues.'
  },
  {
    icon: '🦠',
    title: 'Algae Treatment',
    desc: 'Shock and targeted treatment for green, mustard, or black algae.'
  },
  {
    icon: '🌤️',
    title: 'Seasonal Open & Close',
    desc: 'Full opening in spring and winterizing before the cold hits.'
  },
  {
    icon: '🔧',
    title: 'Equipment Repair',
    desc: 'Pump, heater, and automation repairs from the same crew that cleans your pool and spa.'
  },
  {
    icon: '✨',
    title: 'Green-to-Clean Recovery',
    desc: 'One-time deep clean for pools and spas that have been neglected or just moved into.'
  }
];

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">What we do</span>
          <h2>Everything your pool and spa needs, nothing it doesn't.</h2>
          <p>
            Every visit follows the same checklist, so the quality doesn't depend on who shows up.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s, idx) => (
            <div className="service-card" key={idx}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '60px',
            textAlign: 'center',
            padding: '40px 24px',
            background: 'white',
            borderRadius: '18px',
            border: '1px solid var(--border-light)'
          }}
        >
          <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
            Ready for a crystal clean pool or spa?
          </h3>
          <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 20px' }}>
            Get on our regular weekly or bi-weekly maintenance schedule today.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#quote" className="btn-primary">
              Request a Free Quote
            </Link>
            <Link to="/schedule" className="btn-ghost" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>
              Check Open Schedule
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

