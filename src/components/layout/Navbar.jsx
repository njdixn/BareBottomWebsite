import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const scrollToQuote = (e) => {
    closeMobileMenu();
    if (location.pathname === '/') {
      const quoteEl = document.getElementById('quote');
      if (quoteEl) {
        e.preventDefault();
        quoteEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="topnav">
      <div className="wrap">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <img src="/images/logo.png" alt="Bare Bottom Pool and Spa logo" className="logo-img" />
        </Link>

        <nav>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
            Services
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pricing
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>
            Schedule
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>
        </nav>

        <Link to="/#quote" className="nav-cta" onClick={scrollToQuote}>
          Get a Quote
        </Link>

        <button 
          className="mobile-nav-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => (isActive && location.pathname === '/' ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/services" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Services
          </NavLink>
          <NavLink to="/pricing" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Pricing
          </NavLink>
          <NavLink to="/schedule" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            Schedule
          </NavLink>
          <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>
          <Link to="/#quote" className="nav-cta" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={scrollToQuote}>
            Get a Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}

