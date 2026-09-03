import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminAvailability from '../components/admin/AdminAvailability';
import AdminPricing from '../components/admin/AdminPricing';
import AdminSpecials from '../components/admin/AdminSpecials';
import AdminSocialLinks from '../components/admin/AdminSocialLinks';
import AdminPaymentMethods from '../components/admin/AdminPaymentMethods';
import AdminLeads from '../components/admin/AdminLeads';
import { ExternalLink, LogOut } from 'lucide-react';

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <header className="admin-topbar">
        <div className="brand">
          <img src="/images/logo.png" alt="Bare Bottom Logo" className="logo-img" />
          <span>Admin Dashboard</span>
        </div>

        <div className="admin-topbar-actions">
          <Link to="/" className="admin-view-site-link" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </Link>

          <button onClick={handleLogout} className="admin-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </header>

      <main className="admin-wrap">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Welcome back</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
              Logged in as: {user?.email || 'Owner'}
            </p>
          </div>
        </div>

        {/* 1. Availability Calendar & Weekly Editor */}
        <AdminAvailability />

        {/* 2. Pricing Plans Editor */}
        <AdminPricing />

        {/* 3. Specials Editor */}
        <AdminSpecials />

        {/* 4. Social Media Links Manager */}
        <AdminSocialLinks />

        {/* 5. Ways to Pay Payment Methods Manager */}
        <AdminPaymentMethods />

        {/* 6. Leads and Requests List */}
        <AdminLeads />
      </main>
    </div>
  );
}
