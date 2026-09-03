import React, { useState, useEffect } from 'react';
import { usePricing } from '../../hooks/usePricing';
import { Eye, EyeOff, Plus, Trash2, DollarSign } from 'lucide-react';

const MAX_PLANS = 20;

export default function AdminPricing() {
  const { plans, loading, error, addPlan, deletePlan, updatePricingPlans } = usePricing();
  const [localPlans, setLocalPlans] = useState([]);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [sqlNotice, setSqlNotice] = useState(false);

  useEffect(() => {
    if (plans) {
      setLocalPlans(
        plans.map((p) => ({
          ...p,
          active: p.active !== false,
          show_price: p.show_price !== false,
          featuresText: (p.features || []).join('\n')
        }))
      );
    }
  }, [plans]);

  const handleFieldChange = (id, field, value) => {
    setLocalPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPlan = async () => {
    if (localPlans.length >= MAX_PLANS) return;

    setAdding(true);
    setStatus({ message: '', type: '' });

    const res = await addPlan({
      plan_name: `New Plan ${localPlans.length + 1}`,
      price: 99,
      price_suffix: '/mo',
      features: ['Weekly skim & vacuum', 'Chemical test & balance'],
      featured: false,
      active: true,
      show_price: true
    });

    if (res.success) {
      setStatus({ message: 'New plan added! Click "Save pricing" after editing.', type: 'ok' });
    } else {
      setStatus({ message: `Could not add plan: ${res.error}`, type: 'err' });
    }

    setAdding(false);
  };

  const handleDeletePlan = async (id, name) => {
    if (window.confirm(`Are you sure you want to completely delete "${name}"? To hide it while keeping all details, uncheck "Visible on website" instead.`)) {
      setSaving(true);
      const res = await deletePlan(id);
      if (res.success) {
        setStatus({ message: 'Plan deleted.', type: 'ok' });
      } else {
        setStatus({ message: `Delete failed: ${res.error}`, type: 'err' });
      }
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ message: 'Saving…', type: '' });
    setSqlNotice(false);

    const updates = localPlans.map((p) => ({
      id: p.id,
      plan_name: p.plan_name,
      short_name: p.short_name?.trim() || p.plan_name?.split(' ')[0]?.trim() || 'Plan',
      price: parseFloat(p.price) || 0,
      price_suffix: p.price_suffix || '/mo',
      featured: Boolean(p.featured),
      active: Boolean(p.active),
      show_price: Boolean(p.show_price),
      features: p.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
    }));

    const res = await updatePricingPlans(updates);

    if (res.success) {
      setStatus({ message: 'Pricing saved successfully ✓', type: 'ok' });
      if (res.schemaNotice) {
        setSqlNotice(true);
      }
    } else {
      setStatus({ message: 'Save failed — please try again.', type: 'err' });
    }

    setSaving(false);
  };

  const canAddMore = localPlans.length < MAX_PLANS;

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Pricing plans ({localPlans.length} / {MAX_PLANS})</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.85rem' }}>
            Customize plan names, rates, price display, features, visibility, and featured tags.
          </p>
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={handleAddPlan}
          disabled={!canAddMore || adding || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: !canAddMore ? 0.5 : 1,
            cursor: !canAddMore ? 'not-allowed' : 'pointer'
          }}
        >
          <Plus size={15} />
          {adding ? 'Adding…' : canAddMore ? '+ Add new plan' : 'Plan limit reached (20)'}
        </button>
      </div>

      {sqlNotice && (
        <div style={{ background: '#fff4e0', border: '1px solid #fae1af', padding: '12px 14px', borderRadius: '8px', marginTop: '16px', fontSize: '0.84rem', color: '#855d10' }}>
          <b>Database Notice:</b> To permanently store the <code>show_price</code> and <code>active</code> columns in Supabase, run this query in your Supabase SQL Editor:
          <pre style={{ background: 'white', padding: '6px 10px', borderRadius: '4px', margin: '6px 0 0', overflowX: 'auto' }}>
            alter table pricing add column if not exists show_price boolean not null default true;{'\n'}
            alter table pricing add column if not exists active boolean not null default true;{'\n'}
            alter table pricing add column if not exists short_name text not null default '';
          </pre>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '20px' }}>Loading pricing plans…</p>
      ) : error ? (
        <p style={{ color: '#c0442c', fontSize: '.85rem', marginTop: '20px' }}>Could not load pricing: {error}</p>
      ) : localPlans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)' }}>
          <p>No pricing plans found.</p>
          <button className="add-btn" onClick={handleAddPlan} disabled={adding}>
            + Create your first plan
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {localPlans.map((plan, index) => (
            <div
              className="plan-edit"
              key={plan.id || index}
              style={{
                background: !plan.active ? '#fafcfc' : 'white',
                opacity: !plan.active ? 0.82 : 1,
                borderLeft: !plan.active ? '3px solid #b8d2d0' : plan.featured ? '3px solid var(--coral)' : '3px solid var(--teal)',
                paddingLeft: '14px',
                marginBottom: '16px',
                borderRadius: '8px'
              }}
            >
              {/* Row 1: Plan Name Input, Short Name Input, Price Input, Suffix Input */}
              <div className="row1" style={{ gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={plan.plan_name}
                    onChange={(e) => handleFieldChange(plan.id, 'plan_name', e.target.value)}
                    placeholder="e.g. Standard Care"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d8e6e5',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ flex: '0 0 130px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={plan.short_name || ''}
                    onChange={(e) => handleFieldChange(plan.id, 'short_name', e.target.value)}
                    placeholder="e.g. Standard"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #d8e6e5',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Price ($)
                  </label>
                  <span className="price-input">
                    $
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handleFieldChange(plan.id, 'price', e.target.value)}
                      min="0"
                      step="1"
                      style={{ width: '80px' }}
                    />
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Billing Suffix
                  </label>
                  <input
                    type="text"
                    value={plan.price_suffix || '/mo'}
                    onChange={(e) => handleFieldChange(plan.id, 'price_suffix', e.target.value)}
                    placeholder="/mo"
                    style={{
                      width: '90px',
                      padding: '8px 10px',
                      border: '1px solid #d8e6e5',
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      fontFamily: "'IBM Plex Mono', monospace"
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Checkboxes (Most Popular, Show Price, Visible on Site) + Delete Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0 12px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {/* Featured / Most popular toggle */}
                  <label className="featured-toggle" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(plan.featured)}
                      onChange={(e) => handleFieldChange(plan.id, 'featured', e.target.checked)}
                    />
                    <span style={{ fontWeight: plan.featured ? 600 : 400, color: plan.featured ? 'var(--coral)' : 'var(--muted)', fontSize: '0.82rem' }}>
                      ⭐ Most popular badge
                    </span>
                  </label>

                  {/* Show Price toggle */}
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(plan.show_price)}
                      onChange={(e) => handleFieldChange(plan.id, 'show_price', e.target.checked)}
                    />
                    <span style={{ color: plan.show_price ? 'var(--navy)' : 'var(--muted)', fontWeight: plan.show_price ? 500 : 400 }}>
                      <DollarSign size={13} style={{ verticalAlign: 'middle', marginRight: '1px' }} />
                      {plan.show_price ? 'Display dollar price' : 'Hide price (show "Contact for Rates")'}
                    </span>
                  </label>

                  {/* Visible / Active toggle */}
                  <label
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.82rem',
                      color: plan.active ? 'var(--navy)' : 'var(--muted)',
                      background: plan.active ? '#e5f8ee' : '#f0f4f4',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      border: plan.active ? '1px solid #c2eed5' : '1px solid #dfeceb'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(plan.active)}
                      onChange={(e) => handleFieldChange(plan.id, 'active', e.target.checked)}
                    />
                    {plan.active ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1c8a53', fontWeight: 600 }}>
                        <Eye size={12} />
                        Visible on website
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7a9499' }}>
                        <EyeOff size={12} />
                        Hidden from customers
                      </span>
                    )}
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePlan(plan.id, plan.plan_name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c0442c',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 6px'
                  }}
                  title="Permanently remove plan"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

              {/* Row 3: Features checklist */}
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                Features (One line per feature checklist)
              </label>
              <textarea
                value={plan.featuresText}
                onChange={(e) => handleFieldChange(plan.id, 'featuresText', e.target.value)}
                placeholder="Weekly skim & vacuum&#10;Chemical test & balance&#10;Monthly filter cleaning"
                rows={3}
              />
            </div>
          ))}
        </div>
      )}

      <div className="card-footer" style={{ marginTop: '16px' }}>
        <button className="save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save pricing'}
        </button>
        {canAddMore && (
          <button className="add-btn" onClick={handleAddPlan} disabled={adding}>
            + Add plan ({localPlans.length}/{MAX_PLANS})
          </button>
        )}
        {status.message && (
          <span className={`status-msg ${status.type}`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}
