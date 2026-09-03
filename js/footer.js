function renderFooter() {
  const mount = document.getElementById('siteFooter');
  if (!mount) return;

  mount.innerHTML = `
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <div class="brand"><img src="images/logo.png" alt="Bare Bottom Pool and Spa logo" class="logo-img"></div>
          <p style="font-size:.85rem;max-width:260px;margin-top:10px;">Weekly or bi-weekly pool and <br> spa care for Central Washington. <br> Nobody likes a dirty bottom.</p>
          <div class="social-row">
            <a href="#" aria-label="Facebook" class="social-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M15 8.5h2V5.4c-.34-.05-1.52-.15-2.9-.15-2.87 0-4.83 1.8-4.83 5.12v2.63H6.4v3.5h2.87V21h3.6v-4.5h2.76l.44-3.5h-3.2v-2.3c0-1 .28-1.7 1.73-1.7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
            </a>
            <a href="#" aria-label="Instagram" class="social-icon">
              <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="3.6" stroke="currentColor" stroke-width="1.4"/><circle cx="16.6" cy="7.4" r="0.9" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="X" class="social-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </a>
            <a href="#" aria-label="TikTok" class="social-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M14 4v9.6a2.9 2.9 0 1 1-2.4-2.86M14 4c.35 1.9 1.7 3.4 3.6 3.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-cols">
          <div>
            <h4>Contact</h4>
            <span class="owner-name">Emily Abramowski</span>
            <a href="tel:15092013467">(509) 201-3467</a>
            <a href="mailto:barebottomspa@gmail.com">barebottomspa@gmail.com</a>
          </div>
          <div>
            <h4>Site</h4>
            <a href="#services" class="route-link">Services</a>
            <a href="#pricing" class="route-link">Pricing</a>
            <a href="#schedule" class="route-link">Schedule</a>
            <a href="#about" class="route-link">About</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <span>Licensed & Certified</span>
      </div>
    </div>
  `;
  
}

renderFooter();