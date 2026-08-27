// ============================================
// Specials editor — add, edit, toggle active, remove.
// ============================================

async function loadSpecials() {
  const { data, error } = await sb.from('specials').select('*').order('sort_order');
  if (error) {
    document.getElementById('specialsList').innerHTML = '<p style="color:#c0442c;">Could not load specials.</p>';
    return;
  }
  document.getElementById('specialsList').innerHTML = data.map(s => `
    <div class="special-edit" data-id="${s.id}">
      <div class="row1">
        <input type="text" class="title-field" value="${s.title.replace(/"/g, '&quot;')}" placeholder="Special title">
      </div>
      <textarea class="desc-field" placeholder="Description shown to visitors">${s.description}</textarea>
      <div class="row2">
        <label class="active-toggle">
          <input type="checkbox" class="active-field" ${s.active ? 'checked' : ''}>
          Currently active
        </label>
        <button class="remove-btn" data-remove="${s.id}">Remove</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Remove this special?')) return;
      await sb.from('specials').delete().eq('id', btn.dataset.remove);
      loadSpecials();
    });
  });
}

document.getElementById('addSpecial').addEventListener('click', async () => {
  await sb.from('specials').insert([{ title: 'New special', description: 'Describe the offer here.', active: false, sort_order: 99 }]);
  loadSpecials();
});

document.getElementById('saveSpecials').addEventListener('click', async () => {
  const btn = document.getElementById('saveSpecials');
  const status = document.getElementById('specialsStatus');
  btn.disabled = true;
  status.textContent = 'Saving…';
  status.className = 'status-msg';

  const editEls = document.querySelectorAll('.special-edit');
  const updates = Array.from(editEls).map(el => {
    const id = el.dataset.id;
    const title = el.querySelector('.title-field').value.trim();
    const description = el.querySelector('.desc-field').value.trim();
    const active = el.querySelector('.active-field').checked;
    return sb.from('specials').update({ title, description, active }).eq('id', id);
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
