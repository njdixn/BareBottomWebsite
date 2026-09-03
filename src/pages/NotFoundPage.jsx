import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
      <span className="eyebrow">404 Error</span>
      <h1 style={{ fontSize: '2.4rem', margin: '12px 0 16px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
        The page you're looking for doesn't exist or has moved. Let's get you back into clear water.
      </p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}

