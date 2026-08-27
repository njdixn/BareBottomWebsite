const SLOT_CLASS = {
  Open: 'slot-open',
  Limited: 'slot-limited',
  Full: 'slot-full'
};

async function loadAvailability() {
  const el = document.getElementById('dayPicker');
  const { data, error } = await sb
    .from('availability')
    .select('*')
    .order('day_order', { ascending: true });

  if (error || !data || data.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:.85rem;">Availability is currently unavailable — please call to check openings.</p>';
    return;
  }

  el.innerHTML = data.map(day => `
    <div class="day-row">
      <span class="name">${day.day_name}</span>
      <span class="slot-tag ${SLOT_CLASS[day.status] || 'slot-open'}">${day.status}</span>
    </div>
  `).join('');
}

async function loadPricing() {
  const el = document.getElementById('pricingGrid');
  const { data, error } = await sb
    .from('pricing')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    el.innerHTML = '<p style="color:#a9c9c6;font-size:.9rem;">Pricing is temporarily unavailable — please call for current rates.</p>';
    return;
  }

  el.innerHTML = data.map(plan => `
    <div class="plan ${plan.featured ? 'featured' : ''}">
      ${plan.featured ? '<span class="badge">MOST POPULAR</span>' : ''}
      <h3>${plan.plan_name}</h3>
      <div class="price">$${Number(plan.price).toFixed(0)}<sub>${plan.price_suffix}</sub></div>
      <ul>
        ${plan.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <button>Choose ${plan.plan_name.split(' ')[0]}</button>
    </div>
  `).join('');
}

async function loadSpecials() {
  const homeBlock = document.getElementById('specialsHome');
  const homeGrid = document.getElementById('specialsGridHome');
  const pricingHead = document.getElementById('specialsPricingHead');
  const pricingGrid = document.getElementById('specialsGridPricing');

  const { data, error } = await sb
    .from('specials')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  const hasSpecials = !error && data && data.length > 0;

  const cardsHtml = hasSpecials
    ? data.map(s => `
        <div class="special-card">
          <span class="special-tag">SPECIAL</span>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
      `).join('')
    : '';

  // Home: hide the whole block if there's nothing to show
  homeBlock.style.display = hasSpecials ? 'block' : 'none';
  homeGrid.innerHTML = cardsHtml;

  // Pricing: hide heading + grid together if there's nothing to show
  pricingHead.style.display = hasSpecials ? 'block' : 'none';
  pricingGrid.style.display = hasSpecials ? 'grid' : 'none';
  pricingGrid.innerHTML = cardsHtml;
}

loadAvailability();
loadPricing();
loadSpecials();