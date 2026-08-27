// ============================================
// Weekly availability editor.
// ============================================

const SLOT_OPTIONS = ['Open', 'Limited', 'Full'];

async function loadAvailability() {
  const { data, error } = await sb.from('availability').select('*').order('day_order');
  if (error) {
    document.getElementById('availList').innerHTML = '<p style="color:#c0442c;">Could not load availability.</p>';
    return;
  }
  document.getElementById('availList').innerHTML = data.map(day => `
    <div class="avail-row">
      <span class="name">${day.day_name}</span>
      <select data-id="${day.id}">
        ${SLOT_OPTIONS.map(s => `<option value="${s}" ${s === day.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
  `).join('');
}

document.getElementById('saveAvail').addEventListener('click', async () => {
  const btn = document.getElementById('saveAvail');
  const status = document.getElementById('availStatus');
  btn.disabled = true;
  status.textContent = 'Saving…';
  status.className = 'status-msg';

  const selects = document.querySelectorAll('#availList select');
  const updates = Array.from(selects).map(sel =>
    sb.from('availability').update({ status: sel.value }).eq('id', sel.dataset.id)
  );

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
