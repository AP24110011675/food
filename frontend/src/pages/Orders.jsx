import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Clock, CheckCircle, Calendar, ArrowRight, ExternalLink, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const StatusStepper = ({ currentStatus }) => {
    let statuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    
    let statusClean = (currentStatus || 'placed').toLowerCase();
    
    if (statusClean.includes('payment pending')) statusClean = 'placed';
    if (statusClean.includes('cancelled')) {
      statuses = ['Placed', 'Cancelled'];
      statusClean = 'cancelled';
    }

    let currentIndex = statuses.findIndex(s => s.toLowerCase() === statusClean);
    if (currentIndex === -1) currentIndex = 0;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', position: 'relative', padding: '0 20px' }}>
        <div style={{ position: 'absolute', top: '16px', left: '60px', right: '60px', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
        <div style={{ 
          position: 'absolute', 
          top: '16px', 
          left: '60px', 
          width: `${(currentIndex / (statuses.length - 1)) * (100 - (120/statuses.length * 2))}%`, 
          height: '2px', 
          background: 'var(--primary)', 
          zIndex: 0, 
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
        }} />
        
        {statuses.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '90px' }}>
              <motion.div 
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary)' : '#fff',
                  borderColor: isPending ? '#e2e8f0' : 'var(--primary)',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(var(--primary-rgb), 0.2)' : 'none'
                }}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  border: '2px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted || isCurrent ? '#fff' : '#cbd5e1',
                  marginBottom: '10px',
                  transition: 'all 0.4s ease'
                }}
              >
                {isCompleted ? <CheckCircle size={16} strokeWidth={3} /> : (isCurrent ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }} />)}
              </motion.div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: isCurrent ? 800 : 600, 
                color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return (
    <div className="container" style={{ padding: '120px 20px' }}>
      <div className="skeleton" style={{ height: '60px', width: '300px', marginBottom: '48px', borderRadius: '12px' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '40px', height: '240px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div className="skeleton" style={{ height: '40px', width: '240px', borderRadius: '8px' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '120px', borderRadius: '20px' }}></div>
            </div>
            <div className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '12px' }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '100px 20px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px' }}>Order <span style={{ color: 'var(--primary)' }}>History</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Track and manage your past orders with ease.</p>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <motion.div 
          className="card" 
          style={{ textAlign: 'center', padding: '100px 20px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', width: '140px', height: '140px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            <ShoppingBag size={70} style={{ color: 'rgba(var(--primary-rgb), 0.2)' }} />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>No orders found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>It looks like you haven't placed any orders yet. Let's change that!</p>
          <Link to="/restaurants" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem', borderRadius: '16px' }}>
            Explore Delicious Food <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {[...orders].reverse().map((order, index) => (
            <motion.div 
              key={order._id} 
              className="card" 
              style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-lg)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(var(--primary-rgb), 0.08)', padding: '12px', borderRadius: '16px', color: 'var(--primary)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '10px', 
                     background: order.status.toLowerCase() === 'delivered' ? 'rgba(21, 179, 21, 0.1)' : 'rgba(var(--primary-rgb), 0.1)', 
                     color: order.status.toLowerCase() === 'delivered' ? '#16a34a' : 'var(--primary)', 
                     padding: '10px 24px', 
                     borderRadius: '14px', 
                     fontSize: '1rem', 
                     fontWeight: 800,
                     letterSpacing: '0.5px'
                   }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'currentColor', 
                      animation: order.status.toLowerCase() !== 'delivered' ? 'pulse 2s infinite' : 'none' 
                    }}></div>
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '60px' }} className="grid-responsive">
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#f8fafc', transition: 'transform 0.2s ease' }} className="hover-pop">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <ImageSafe src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.name}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Quantity: {item.qty}</p>
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  
                  <StatusStepper currentStatus={order.status} />
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '32px', borderRadius: '24px', height: 'fit-content', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <h5 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Billing Summary</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span>Subtotal</span>
                      <span style={{ color: 'var(--text-primary)' }}>₹{order.totalPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span>Delivery</span>
                      <span style={{ color: '#16a34a', fontWeight: 800 }}>FREE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '2px dashed #cbd5e1', marginTop: '4px' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>Paid</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.4rem' }}>₹{order.totalPrice}</span>
                    </div>
                  </div>
                  
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '32px', justifyContent: 'center', borderRadius: '14px', height: '48px', fontWeight: 700 }}>
                    Reorder <ExternalLink size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <style>{`
        @media (max-width: 1024px) {
          .grid-responsive { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default Orders;
