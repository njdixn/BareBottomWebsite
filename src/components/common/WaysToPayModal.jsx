import React from 'react';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { X, CreditCard, Check, Copy } from 'lucide-react';

export default function WaysToPayModal({ isOpen, onClose }) {
  const { paymentMethods, loading } = usePaymentMethods();
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const activeMethods = paymentMethods.filter((m) => m.active !== false);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 37, 48, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '18px',
          maxWidth: '500px',
          width: '100%',
          padding: '28px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <CreditCard size={22} color="var(--teal)" />
          <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Ways to Pay</h3>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0 0 20px' }}>
          Bare Bottom Pool and Spa accepts several convenient payment options:
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading payment options…</p>
        ) : activeMethods.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Please contact us for payment details.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
            {activeMethods.map((method) => (
              <div
                key={method.id}
                style={{
                  background: '#f4faf9',
                  border: '1px solid #dfeceb',
                  borderRadius: '12px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>
                    {method.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(method.id, method.handle)}
                    style={{
                      background: 'white',
                      border: '1px solid #d8e6e5',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--teal)',
                      cursor: 'pointer'
                    }}
                    title="Copy to clipboard"
                  >
                    {copiedId === method.id ? (
                      <>
                        <Check size={12} color="#1c8a53" />
                        <span style={{ color: '#1c8a53' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'var(--teal)', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>
                  {method.handle}
                </div>
                {method.instructions && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '6px 0 0', lineHeight: 1.4 }}>
                    {method.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

