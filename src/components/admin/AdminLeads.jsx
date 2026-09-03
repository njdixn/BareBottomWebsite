import React from 'react';
import { useLeads } from '../../hooks/useLeads';
import { RotateCw } from 'lucide-react';

export default function AdminLeads() {
  const { leads, loading, error, refetch } = useLeads();

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>Recent Leads & Quote Requests</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.85rem' }}>
            Submissions from the quote and schedule forms on the site, newest first.
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          style={{
            background: 'none',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: 'var(--navy)',
            cursor: 'pointer'
          }}
          title="Refresh leads"
        >
          <RotateCw size={14} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Loading leads…</p>
        ) : error ? (
          <p style={{ color: '#c0442c', fontSize: '.85rem' }}>Could not load quote requests: {error}</p>
        ) : !leads || leads.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', padding: '16px 0' }}>
            No quote requests or leads submitted yet.
          </p>
        ) : (
          <div id="leadsList">
            {leads.map((l) => {
              const when = l.created_at
                ? new Date(l.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })
                : 'Just now';

              return (
                <div className="lead-row" key={l.id}>
                  <div className="lead-top">
                    <span>
                      {l.first_name || ''} {l.last_name || ''}
                    </span>
                    <span className="lead-time">{when}</span>
                  </div>

                  <div className="lead-meta">
                    {l.phone && <span>📞 {l.phone} </span>}
                    {l.email && <span> · ✉️ {l.email}</span>}
                  </div>

                  {l.address && (
                    <div className="lead-meta">
                      📍 {l.address}
                    </div>
                  )}

                  <div className="lead-meta">
                    {l.pool_size && <span>Pool: {l.pool_size} · </span>}
                    {l.service_frequency && <span>Frequency: {l.service_frequency} · </span>}
                    <span>Preferred day: {l.preferred_day || 'No preference'}</span>
                  </div>

                  {l.notes && (
                    <div className="lead-notes">
                      "{l.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

