import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CreditCard,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, preparing, delivered, deleted

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      const ordersData = res.data.data || res.data || [];
      setOrders(ordersData);
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/order/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'pending') return o.status === 'Pending';
    if (filter === 'confirmed') return o.status === 'Confirmed';
    if (filter === 'preparing') return o.status === 'Preparing';
    if (filter === 'delivered') return o.status === 'Delivered';
    if (filter === 'deleted') return o.status === 'Deleted';
    return true;
  });

  if (loading) return (
    <div className="container" style={{ padding: '120px 20px' }}>
      <div className="skeleton" style={{ height: '60px', width: '300px', marginBottom: '40px' }}></div>
      <div style={{ display: 'grid', gap: '24px' }}>
        {[1, 2, 3].map(i => <div key={i} className="card" style={{ height: '200px' }}></div>)}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '100px 20px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '12px' }}>
            Manage <span className="text-gradient">Orders</span> 👨‍🍳
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Global order management and payment verification.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', background: '#f1f5f9', padding: '6px', borderRadius: '16px' }}>
          {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'deleted'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: filter === f ? 'white' : 'transparent',
                color: filter === f ? 'var(--primary)' : '#64748b',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: filter === f ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card"
              style={{ padding: '32px', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-md)' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '48px' }} className="grid-responsive">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: 'var(--secondary)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        ORD-#{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ 
                      color: order.status === 'Delivered' ? '#16a34a' : '#d97706',
                      background: order.status === 'Delivered' ? '#f0fdf4' : '#fffbeb',
                      padding: '6px 16px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 800
                    }}>
                      {order.status.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '12px', borderRadius: '16px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden' }}>
                          <ImageSafe src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, margin: 0 }}>{item.name}</p>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Qty: {item.qty} × ₹{item.price}</p>
                        </div>
                        <span style={{ fontWeight: 800 }}>₹{item.qty * item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={18} color="#94a3b8" />
                      <div style={{ fontSize: '0.9rem' }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{order.userId?.name || 'Guest'}</p>
                        <p style={{ color: '#64748b', margin: 0 }}>{order.userId?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={18} color="#94a3b8" />
                      <div style={{ fontSize: '0.9rem' }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>Delivery Location</p>
                        <p style={{ color: '#64748b', margin: 0 }}>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.02)' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Payment Info</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Method</span>
                      <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{order.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Total</span>
                      <span style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select 
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      value={order.status}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', fontWeight: 700, outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Deleted">Deleted</option>
                    </select>

                    <button 
                      onClick={async () => {
                        if (window.confirm('Mark this order as Deleted?')) {
                          await handleUpdateStatus(order._id, 'Deleted');
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 700, padding: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Mark as Deleted
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
               <Package size={64} color="#e2e8f0" style={{ marginBottom: '20px' }} />
               <h3>No orders matching this filter</h3>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOrders;
