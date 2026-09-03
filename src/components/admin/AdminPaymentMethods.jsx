import React, { useState, useEffect } from 'react';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { Eye, EyeOff, Plus, Trash2, CreditCard } from 'lucide-react';

export default function AdminPaymentMethods() {
  const { paymentMethods, loading, addPaymentMethod, updatePaymentMethods, deletePaymentMethod } = usePaymentMethods();
  const [localMethods, setLocalMethods] = useState([]);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (paymentMethods) setLocalMethods(paymentMethods);
  }, [paymentMethods]);

  const handleFieldChange = (id, field, value) => {
    setLocalMethods((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAdd = async () => {
    setAdding(true);
    await addPaymentMethod({
      title: 'Credit Card / Stripe',
      handle: 'Pay Online Invoice',
      instructions: 'Payable via secure emailed invoice link.',
      active: true
    });
    setAdding(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove ${title}? To hide it without deleting, uncheck the visibility toggle instead.`)) {
      await deletePaymentMethod(id);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ message: 'Saving…', type: '' });

    const res = await updatePaymentMethods(localMethods);

    if (res.success) {
      setStatus({ message: 'Ways to pay saved ✓', type: 'ok' });
    } else {
      setStatus({ message: 'Save failed — please try again.', type: 'err' });
    }

    setSaving(false);
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="var(--teal)" />
            <span>Ways to Pay (Venmo, PayPal, etc.)</span>
          </h3>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.85rem' }}>
            Manage payment handles, accounts, and instructions visible to customers.
          </p>
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={handleAdd}
          disabled={adding || loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} />
          {adding ? 'Adding…' : '+ Add payment option'}
        </button>
      </div>

      <div style={{ marginTop: '18px' }}>
        {localMethods.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '14px 16px',
              border: '1px solid #eef4f3',
              borderRadius: '10px',
              marginBottom: '12px',
              background: item.active ? 'white' : '#fafcfc',
              opacity: item.active ? 1 : 0.82
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px' }}>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleFieldChange(item.id, 'title', e.target.value)}
                  placeholder="Method name (e.g. Venmo)"
                  style={{
                    width: '140px',
                    padding: '7px 10px',
                    border: '1px solid #d8e6e5',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--navy)'
                  }}
                />
                <input
                  type="text"
                  value={item.handle}
                  onChange={(e) => handleFieldChange(item.id, 'handle', e.target.value)}
                  placeholder="Handle or Account (e.g. @barebottomspa)"
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    border: '1px solid #d8e6e5',
                    borderRadius: '6px',
                    fontSize: '0.86rem',
                    fontFamily: "'IBM Plex Mono', monospace"
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Show / Hide toggle */}
                <label
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.8rem',
                    color: item.active ? '#1c8a53' : '#7a9499',
                    background: item.active ? '#e5f8ee' : '#f0f4f4',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: item.active ? '1px solid #c2eed5' : '1px solid #dfeceb'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(item.active)}
                    onChange={(e) => handleFieldChange(item.id, 'active', e.target.checked)}
                  />
                  {item.active ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Eye size={12} />
                      Visible
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  )}
                </label>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c0442c',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Delete payment method"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={item.instructions || ''}
                onChange={(e) => handleFieldChange(item.id, 'instructions', e.target.value)}
                placeholder="Notes/instructions for customer (e.g. Include invoice number or address in payment note)"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  border: '1px solid #eef4f3',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  background: 'var(--white)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer" style={{ marginTop: '16px' }}>
        <button className="save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save payment methods'}
        </button>
        {status.message && (
          <span className={`status-msg ${status.type}`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}

