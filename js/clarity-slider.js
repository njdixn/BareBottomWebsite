// ============================================
// Draggable before/after "clarity" slider in the hero section.
// ============================================

const clarityHandle = document.getElementById('clarityHandle');
const clarityAfter = document.getElementById('clarityAfter');
const clarityBox = document.getElementById('clarity');
let clarityDragging = false;

function setClaritySplit(clientX) {
  const rect = clarityBox.getBoundingClientRect();
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(4, Math.min(96, pct));
  clarityAfter.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  clarityHandle.style.left = pct + '%';
}

clarityHandle.addEventListener('mousedown', () => clarityDragging = true);
window.addEventListener('mouseup', () => clarityDragging = false);
window.addEventListener('mousemove', e => { if (clarityDragging) setClaritySplit(e.clientX); });

clarityHandle.addEventListener('touchstart', () => clarityDragging = true);
window.addEventListener('touchend', () => clarityDragging = false);
window.addEventListener('touchmove', e => { if (clarityDragging) setClaritySplit(e.touches[0].clientX); }, { passive: true });
