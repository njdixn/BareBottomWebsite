// ============================================
// Pricing plans editor.
// ============================================

async function loadPricing() {
  const { data, error } = await sb.from('pricing').select('*').order('sort_order');
  if (error) {
    document.getElementById('pricingList').innerHTML = '<p style="color:#c0442c;">Could not load pricing.</p>';
    return;
  }
  document.getElementById('pricingList').innerHTML = data.map(plan => `
    <div class="plan-edit" data-id="${plan.id}">
      <div class="row1">
        <span class="plan-name">${plan.plan_name}</span>
        <span class="price-input">$<input type="number" class="price-field" value="${plan.price}" min="0" step="1"><span>${plan.price_suffix}</span></span>
        <label class="featured-toggle">
          <input type="checkbox" class="featured-field" ${plan.featured ? 'checked' : ''}>
          Most popular
        </label>
      </div>
      <textarea class="features-field">${plan.features.join('\n')}</textarea>
      <div class="hint">One feature per line — this becomes the checklist on the pricing card.</div>
    </div>
  `).join('');
}

document.getElementById('savePricing').addEventListener('click', async () => {
  const btn = document.getElementById('savePricing');
  const status = document.getElementById('pricingStatus');
  btn.disabled = true;
  status.textContent = 'Saving…';
  status.className = 'status-msg';

  const planEls = document.querySelectorAll('.plan-edit');
  const updates = Array.from(planEls).map(el => {
    const id = el.dataset.id;
    const price = parseFloat(el.querySelector('.price-field').value);
    const featured = el.querySelector('.featured-field').checked;
    const features = el.querySelector('.features-field').value
      .split('\n').map(f => f.trim()).filter(Boolean);
    return sb.from('pricing').update({ price, featured, features }).eq('id', id);
  });

  try {
    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);
    status.textContent = failed ? 'Save failed — try again.' : 'Saved ✓';
    status.className = failed ? 'status-msg err' : 'status-msg ok';
  } catch (e) {
    status.textContent = 'Save failed — try again.';
    status.className = 'status-msg err';
  }
  btn.disabled = false;
});
