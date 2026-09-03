import React, { useState, useEffect } from 'react';
import { useSpecials } from '../../hooks/useSpecials';

export default function AdminSpecials() {
  const { specials, loading, error, addSpecial, updateSpecials, deleteSpecial } = useSpecials(false);
  const [localSpecials, setLocalSpecials] = useState([]);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (specials) {
      setLocalSpecials(specials);
    }
  }, [specials]);

  const handleFieldChange = (id, field, value) => {
    setLocalSpecials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAdd = async () => {
    setAdding(true);
    await addSpecial({
      title: 'New special offer',
      description: 'Describe the promotional offer here.',
      active: false,
      sort_order: (localSpecials.length || 0) + 1
    });
    setAdding(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this special?')) {
      await deleteSpecial(id);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ message: 'Saving…', type: '' });

    const res = await updateSpecials(localSpecials);

    if (res.success) {
      setStatus({ message: 'Saved ✓', type: 'ok' });
    } else {
      setStatus({ message: 'Save failed — please try again.', type: 'err' });
    }

    setSaving(false);
  };

  return (
    <div className="admin-card">
      <h3>Specials & Seasonal Offers</h3>
      <p>
        Shown in the "Current specials" section on the Home and Pricing pages. Turn a special off
        instead of deleting it if you might reuse it later.
      </p>

      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Loading specials…</p>
      ) : error ? (
        <p style={{ color: '#c0442c', fontSize: '.85rem' }}>Could not load specials: {error}</p>
      ) : localSpecials.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: '.88rem', margin: '14px 0' }}>
          No specials currently created. Click "+ Add special" below to create one.
        </p>
      ) : (
        <div>
          {localSpecials.map((s) => (
            <div className="special-edit" key={s.id}>
              <div className="row1">
                <input
                  type="text"
                  className="title-field"
                  value={s.title}
                  onChange={(e) => handleFieldChange(s.id, 'title', e.target.value)}
                  placeholder="Special title"
                />
              </div>
              <textarea
                className="desc-field"
                value={s.description}
                onChange={(e) => handleFieldChange(s.id, 'description', e.target.value)}
                placeholder="Description shown to visitors"
              />
              <div className="row2">
                <label className="active-toggle">
                  <input
                    type="checkbox"
                    className="active-field"
                    checked={s.active}
                    onChange={(e) => handleFieldChange(s.id, 'active', e.target.checked)}
                  />
                  Currently active (visible on website)
                </label>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleDelete(s.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-footer">
        <button className="save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save specials'}
        </button>
        <button className="add-btn" onClick={handleAdd} disabled={adding}>
          {adding ? 'Adding…' : '+ Add special'}
        </button>
        {status.message && (
          <span className={`status-msg ${status.type}`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}

