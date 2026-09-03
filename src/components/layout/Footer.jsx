import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import WaysToPayModal from '../common/WaysToPayModal';

function getSocialIcon(platform) {
  const p = platform.toLowerCase();
  if (p.includes('facebook') || p.includes('fb')) {
    return (
      <svg viewBox="0 0 24 24" fill="none"><path d="M15 8.5h2V5.4c-.34-.05-1.52-.15-2.9-.15-2.87 0-4.83 1.8-4.83 5.12v2.63H6.4v3.5h2.87V21h3.6v-4.5h2.76l.44-3.5h-3.2v-2.3c0-1 .28-1.7 1.73-1.7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
    );
  }
  if (p.includes('instagram') || p.includes('insta')) {
    return (
      <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.4"/><circle cx="16.6" cy="7.4" r="0.9" fill="currentColor"/></svg>
    );
  }
  if (p.includes('tiktok')) {
    return (
      <svg viewBox="0 0 24 24" fill="none"><path d="M14 4v9.6a2.9 2.9 0 1 1-2.4-2.86M14 4c.35 1.9 1.7 3.4 3.6 3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (p.includes('youtube')) {
    return (
      <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.4"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg>
    );
  }
  // Default to X / Twitter or generic share
  return (
    <svg viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { socialLinks } = useSocialLinks();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const activeSocials = (socialLinks || []).filter((s) => s.active !== false);

  return (
    <>
      <footer id="siteFooter">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="brand">
                <Link to="/">
                  <img src="/images/logo.png" alt="Bare Bottom Pool and Spa logo" className="logo-img" />
                </Link>
              </div>
              <p style={{ fontSize: '.86rem', maxWidth: '270px', marginTop: '10px', lineHeight: '1.45' }}>
                Weekly or bi-weekly pool and spa care for Central Washington. <br />
                Nobody likes a dirty bottom.
              </p>

              {/* Dynamic Social Links */}
              {activeSocials.length > 0 && (
                <div className="social-row">
                  {activeSocials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.platform}
                      title={s.platform}
                      className="social-icon"
                    >
                      {getSocialIcon(s.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="footer-cols">
              <div>
                <h4>Contact</h4>
                <span className="owner-name">Emily Abramowski</span>
                <a href="tel:15092013467">(509) 201-3467</a>
                <a href="mailto:barebottomspa@gmail.com">barebottomspa@gmail.com</a>
              </div>

              <div>
                <h4>Site</h4>
                <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>Services</NavLink>
                <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>Pricing</NavLink>
                <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>Schedule</NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--aqua)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'block',
                    marginTop: '8px',
                    textAlign: 'left'
                  }}
                >
                  💳 Ways to Pay (Venmo/PayPal)
                </button>
                <NavLink to="/admin" style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '12px' }}>Owner Login</NavLink>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {currentYear} Bare Bottom Pool and Spa. All rights reserved.</p>
            <span>Licensed & Certified</span>
          </div>
        </div>
      </footer>

      <WaysToPayModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </>
  );
}
