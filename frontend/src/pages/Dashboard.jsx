import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { User, Mail, Phone, ShoppingBag, MapPin, Edit2, Shield, TrendingUp, CreditCard, ChevronRight, Settings, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/orders/myorders');
        const orders = res.data.data || [];
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        setStats({ totalOrders, totalSpent });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ padding: '100px 20px', maxWidth: '1200px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '48px' }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0]}!</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Manage your profile, tracked orders and account settings.</p>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '48px', alignItems: 'start' }} className="grid-responsive">
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <motion.div 
            className="card" 
            style={{ padding: '48px 40px', textAlign: 'center', borderRadius: '32px', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(135deg, var(--primary) 0%, #ff8c42 100%)', opacity: 0.1 }} />
            
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '40px', 
                background: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px', 
                fontSize: '3.5rem', 
                fontWeight: 900,
                boxShadow: '0 12px 24px rgba(var(--primary-rgb), 0.3)',
                transform: 'rotate(-5deg)'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, marginBottom: '32px' }}>Verified Foodie 🍕</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', height: '56px', fontWeight: 700 }}>
                  <Edit2 size={18} style={{ marginRight: '8px' }} /> Update Profile
                </button>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', height: '56px', fontWeight: 700 }}>
                  <Settings size={18} style={{ marginRight: '8px' }} /> Settings
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card" 
            style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', background: '#f8fafc' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              <Shield size={20} color="var(--primary)" />
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>TRUST & SAFETY</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Your data is encrypted and stored securely. We never share your personal information with third parties.
            </p>
          </motion.div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <motion.div 
              className="card hover-pop" 
              style={{ background: 'var(--primary)', color: 'white', padding: '32px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Total Orders</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{stats.totalOrders}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                  <ShoppingBag size={32} />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                <TrendingUp size={16} />
                <span>+2 this month</span>
              </div>
            </motion.div>

            <motion.div 
              className="card hover-pop" 
              style={{ background: '#1e293b', color: 'white', padding: '32px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(30, 41, 59, 0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Lifetime Savings</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{Math.floor(stats.totalSpent * 0.1)}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
                   <CreditCard size={32} />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                 <CheckCircle size={16} />
                 <span>Gold Member Status</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="card" 
            style={{ padding: '48px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-lg)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '40px', color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={24} color="var(--primary)" /> Account Personalization
            </h3>
            
            <div style={{ display: 'grid', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="hover-pop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ background: '#f1f5f9', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email Address</p>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user?.email}</p>
                  </div>
                </div>
                <ChevronRight size={20} color="#cbd5e1" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="hover-pop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ background: '#f1f5f9', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Contact Number</p>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user?.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
                <ChevronRight size={20} color="#cbd5e1" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="hover-pop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ background: '#f1f5f9', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Saved Address</p>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Bandra West, Mumbai, MH</p>
                  </div>
                </div>
                <ChevronRight size={20} color="#cbd5e1" />
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-responsive { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
