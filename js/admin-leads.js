// ============================================
// Read-only feed of "Request a Free Quote" submissions.
// ============================================

async function loadLeads() {
  const el = document.getElementById('leadsList');
  const { data, error } = await sb
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    el.innerHTML = '<p style="color:#c0442c;">Could not load quote requests.</p>';
    return;
  }
  if (!data || data.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:.85rem;">No quote requests yet.</p>';
    return;
  }

  el.innerHTML = data.map(l => {
    const when = new Date(l.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return `
      <div class="lead-row">
        <div class="lead-top">
          <span>${l.first_name || ''} ${l.last_name || ''}</span>
          <span class="lead-time">${when}</span>
        </div>
        <div class="lead-meta">${l.phone || ''} ${l.email ? '· ' + l.email : ''}</div>
        <div class="lead-meta">${l.address || ''}</div>
        <div class="lead-meta">${l.pool_size || ''} · ${l.service_frequency || ''} · Preferred day: ${l.preferred_day || 'n/a'}</div>
        ${l.notes ? `<div class="lead-notes">"${l.notes}"</div>` : ''}
      </div>
    `;
  }).join('');
}
