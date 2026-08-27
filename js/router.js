// ============================================
// Simple hash-based router for the single-page site.
// Each top-level <section class="view" data-view="name"> is shown or
// hidden based on the current URL hash (e.g. #pricing, #schedule).
// ============================================

const VIEW_NAMES = ['home', 'services', 'specials', 'pricing', 'schedule', 'about'];
const DEFAULT_VIEW = 'home';

function getCurrentView() {
  const hash = location.hash.replace('#', '');
  return VIEW_NAMES.includes(hash) ? hash : DEFAULT_VIEW;
}

function renderView() {
  const current = getCurrentView();

  document.querySelectorAll('.view').forEach(section => {
    section.hidden = section.dataset.view !== current;
  });

  document.querySelectorAll('.topnav nav a').forEach(link => {
    const linkView = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', linkView === current);
  });

  window.scrollTo({ top: 0, behavior: 'auto' });
}

window.addEventListener('hashchange', renderView);
window.addEventListener('DOMContentLoaded', renderView);
