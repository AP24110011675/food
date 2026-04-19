import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  Trash2,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    deletedOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/orders')
        ]);
        setStats(statsRes.data.data || statsRes.data);
        const orders = ordersRes.data.data || ordersRes.data || [];
        setRecentOrders(orders.slice(0, 10));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard. Make sure you are logged in as admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to mark this order as Deleted?')) {
      try {
        await api.put(`/admin/order/${id}`, { status: 'Deleted' });
        setRecentOrders(recentOrders.map(o => o._id === id ? { ...o, status: 'Deleted' } : o));
        // Refresh stats
        const statsRes = await api.get('/admin/dashboard');
        setStats(statsRes.data.data || statsRes.data);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update order status');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/order/${id}`, { status });
      setRecentOrders(recentOrders.map(o => o._id === id ? { ...o, status } : o));
      // Refresh stats
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data.data || statsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '120px 20px' }}>
      <div className="skeleton" style={{ height: '60px', width: '300px', borderRadius: '12px', marginBottom: '40px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '60px' }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '24px' }} />)}
      </div>
      <div className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />
    </div>
  );

  if (error) return (
    <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
      <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Access Denied</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>{error}</p>
      <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 20px 100px', marginTop: 'var(--nav-height)', maxWidth: '1400px' }}>
      <header style={{ marginBottom: '60px' }}>
        <h1 className="heading-lg" style={{ marginBottom: '8px' }}>
          Admin <span className="text-gradient">Panel</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 500 }}>
          System overview and order management dashboard.
        </p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '60px' }}>
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={32} />} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
        <StatCard title="Confirmed" value={stats.confirmedOrders} icon={<CheckCircle size={32} />} color="#10b981" bg="rgba(16,185,129,0.1)" />
        <StatCard title="Deleted" value={stats.deletedOrders} icon={<Trash2 size={32} />} color="#ef4444" bg="rgba(239,68,68,0.1)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }} className="grid-responsive">
        {/* Orders Table */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Recent Orders</h2>
            <button className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '12px' }} onClick={() => navigate('/admin/orders')}>
              View All →
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    {['Order ID', 'User', 'Items', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '16px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '80px 40px', textAlign: 'center' }}>
                         <div style={{ opacity: 0.5, marginBottom: '24px' }}><ShoppingBag size={48} style={{ margin: '0 auto' }} /></div>
                         <h3 style={{ color: '#64748b', marginBottom: '16px' }}>No orders found</h3>
                         <button 
                           onClick={async () => {
                             try {
                               setLoading(true);
                               await api.post('/admin/seed-orders');
                               window.location.reload();
                             } catch (err) {
                               alert('Seeding failed. Make sure the endpoint exists.');
                               setLoading(false);
                             }
                           }}
                           className="btn btn-primary"
                           style={{ padding: '12px 24px', borderRadius: '12px' }}
                         >
                           Seed Sample Orders
                         </button>
                      </td>
                    </tr>
                  ) : recentOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.userId?.name || 'Guest'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{order.userId?.email || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.85rem', maxWidth: '200px' }}>
                         <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.items?.map(item => `${item.name} (x${item.qty})`).join(', ')}
                         </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 900, color: 'var(--primary)' }}>
                        ₹{order.totalAmount}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: getStatusBg(order.status),
                          color: getStatusColor(order.status),
                          whiteSpace: 'nowrap'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Deleted">Deleted</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                            title="Delete order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Side Panel */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: '32px', background: 'var(--secondary)', color: 'white', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={24} color="var(--primary)" /> Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.7, fontWeight: 600 }}>Avg. Order Value</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN') : 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.7, fontWeight: 600 }}>Pending Verifications</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>{stats.pendingOrders || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.7, fontWeight: 600 }}>Total Revenue</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#34d399' }}>₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => navigate('/admin/orders')}>
                Manage All Orders <ChevronRight size={18} />
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => navigate('/restaurants')}>
                View Restaurants <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="card"
    style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '28px' }}
  >
    <div style={{ background: bg, color, width: '68px', height: '68px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</h3>
    </div>
  </motion.div>
);

const getStatusBg = (status) => {
  switch (status) {
    case 'Pending': return '#f1f5f9';
    case 'Confirmed': return '#f0fdf4';
    case 'Preparing': return '#eff6ff';
    case 'Delivered': return '#f0fdf4';
    case 'Deleted': return '#fef2f2';
    default: return '#f1f5f9';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#475569';
    case 'Confirmed': return '#16a34a';
    case 'Preparing': return '#3b82f6';
    case 'Delivered': return '#16a34a';
    case 'Deleted': return '#ef4444';
    default: return '#64748b';
  }
};

export default AdminDashboard;
