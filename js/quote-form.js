// ============================================
// "Request a Free Quote" form — saves submissions to Supabase.
// ============================================

document.getElementById('qSubmit').addEventListener('click', async () => {
  const btn = document.getElementById('qSubmit');
  const status = document.getElementById('qStatus');

  const lead = {
    first_name: document.getElementById('qFirstName').value.trim(),
    last_name: document.getElementById('qLastName').value.trim(),
    phone: document.getElementById('qPhone').value.trim(),
    email: document.getElementById('qEmail').value.trim(),
    address: document.getElementById('qAddress').value.trim(),
    pool_size: document.getElementById('qSize').value,
    preferred_day: document.getElementById('qDay').value,
    service_frequency: document.getElementById('qFrequency').value,
    notes: document.getElementById('qNotes').value.trim()
  };

  if (!lead.first_name || !lead.phone) {
    status.textContent = 'Please add at least your name and phone number.';
    status.style.color = '#c0442c';
    status.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  const { error } = await sb.from('leads').insert([lead]);

  if (error) {
    status.textContent = 'Something went wrong — please call or email us directly.';
    status.style.color = '#c0442c';
  } else {
    status.textContent = "Thanks! We'll be in touch within one business day.";
    status.style.color = '#1c8a53';
    document.querySelectorAll('.quote-form input, .quote-form textarea').forEach(el => el.value = '');
  }
  status.style.display = 'block';
  btn.disabled = false;
  btn.textContent = 'Request My Free Quote';
});
