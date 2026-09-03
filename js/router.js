const VIEW_NAMES = ['home', 'services', 'pricing', 'schedule', 'about'];
const DEFAULT_VIEW = 'home';
const SCROLL_TARGETS = { quote: 'quote' };

function getCurrentView() {
  const hash = location.hash.replace('#', '');
  return VIEW_NAMES.includes(hash) ? hash : DEFAULT_VIEW;
}

function renderView() {
  const current = getCurrentView();
  const rawHash = location.hash.replace('#', '');

  document.querySelectorAll('.view').forEach(section => {
    section.hidden = section.dataset.view !== current;
  });

  document.querySelectorAll('.route-link').forEach(link => {
    const linkView = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', linkView === current);
  });

  const scrollTargetId = SCROLL_TARGETS[rawHash];
  if (scrollTargetId) {
    requestAnimationFrame(() => {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

window.addEventListener('hashchange', renderView);
window.addEventListener('DOMContentLoaded', renderView);