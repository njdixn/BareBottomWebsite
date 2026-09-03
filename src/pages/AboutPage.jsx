import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="about-section">
          <div className="about-photo" role="img" aria-label="Pool service professional">
            🏊‍♂️
          </div>

          <div>
            <span className="eyebrow">About us</span>
            <h2 style={{ marginTop: '8px' }}>A family crew, not a call center.</h2>
            <p style={{ color: 'var(--muted)', marginTop: '14px', maxWidth: '520px', lineHeight: '1.6' }}>
              At Bare Bottom Pool &amp; Spa, we bring over a decade of expertise to deliver top-notch
              pool and spa services to Cle Elum and neighboring Central Washington communities. Led by certified
              professional Emily Abramowski, we offer customizable service plans tailored to your unique
              setup, ensuring perfectly balanced, worry-free water all season long.
            </p>

            <div className="stat-row">
              <div className="stat">
                <b>11</b>
                <span>Years in business</span>
              </div>
              <div className="stat">
                <b>400+</b>
                <span>Pools and spas serviced</span>
              </div>
              <div className="stat">
                <b>4.9★</b>
                <span>Average rating</span>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <Link to="/#quote" className="btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

