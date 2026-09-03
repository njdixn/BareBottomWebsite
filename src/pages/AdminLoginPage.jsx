import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signUp, resetPassword, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (session) {
      navigate('/admin', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
        navigate(from, { replace: true });
      } else if (mode === 'signup') {
        const data = await signUp(email.trim(), password);
        if (data.session) {
          // Auto logged in
          navigate(from, { replace: true });
        } else {
          setSuccessMsg(
            'Account created! If Supabase email confirmation is enabled, please check your inbox to confirm before logging in.'
          );
        }
      } else if (mode === 'forgot') {
        await resetPassword(email.trim());
        setSuccessMsg('Password reset email sent! Check your inbox for instructions.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/images/logo.png" alt="Bare Bottom Logo" style={{ height: '44px', margin: '0 auto 12px' }} />
          <h2>
            {mode === 'login' && 'Owner Login'}
            {mode === 'signup' && 'Create Admin Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p>
            {mode === 'login' && 'Log in to update schedule availability, pricing plans, specials, and view leads.'}
            {mode === 'signup' && 'Register a new admin login to manage the Bare Bottom website.'}
            {mode === 'forgot' && "Enter your email and we'll send you a password reset link."}
          </p>
        </div>

        {/* Mode switch tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--white)', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? 'white' : 'transparent',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontWeight: mode === 'login' ? 600 : 500,
              fontSize: '0.82rem',
              color: 'var(--navy)'
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'signup' ? 'white' : 'transparent',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontWeight: mode === 'signup' ? 600 : 500,
              fontSize: '0.82rem',
              color: 'var(--navy)'
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'forgot' ? 'white' : 'transparent',
              boxShadow: mode === 'forgot' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontWeight: mode === 'forgot' ? 600 : 500,
              fontSize: '0.82rem',
              color: 'var(--navy)'
            }}
          >
            Reset
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="adminEmail">Email</label>
            <input
              id="adminEmail"
              type="email"
              placeholder="you@barebottompoolandspa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="field">
              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <button type="submit" className="admin-login-btn" disabled={submitting}>
            {submitting
              ? 'Processing…'
              : mode === 'login'
              ? 'Log In to Dashboard'
              : mode === 'signup'
              ? 'Create Admin Account'
              : 'Send Reset Link'}
          </button>

          {errorMsg && <div className="admin-error-msg">{errorMsg}</div>}
          {successMsg && (
            <div style={{ color: '#1c8a53', fontSize: '0.84rem', marginTop: '14px', padding: '10px 12px', background: '#e5f8ee', borderRadius: '6px' }}>
              {successMsg}
            </div>
          )}
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--teal)', fontSize: '0.84rem' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
