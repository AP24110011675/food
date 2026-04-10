import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, CheckCircle, Truck, Info, Smartphone, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';
import UPIPayment from '../components/UPIPayment';
import { getMenuItemImage } from '../utils/restaurantImages';

const PAYMENT_METHODS = [
  {
    id: 'UPI',
    label: 'UPI / PhonePe / GPay',
    desc: 'Pay instantly via any UPI app',
    icon: <Smartphone size={22} />,
    badge: 'Recommended',
    badgeColor: '#10b981',
  },
  {
    id: 'COD',
    label: 'Cash on Delivery',
    desc: 'Pay when your order arrives',
    icon: <Truck size={22} />,
    badge: null,
  },
];

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // { orderId, paymentMethod }
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [address, setAddress] = useState({
    address: '123 Foodie Lane, Bandra West',
    city: 'Mumbai',
    postalCode: '400050',
    country: 'India',
  });

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!address.address || !address.city || !address.postalCode) {
      alert('Please fill in your delivery address.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image || 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
          price: item.price,
          product: item._id,
        })),
        shippingAddress: address,
        paymentMethod,
        totalPrice: cartTotal,
      };

      const res = await api.post('/orders', orderData);
      if (res.status === 201) {
        const orderId = res.data.data._id;
        setPlacedOrderId(orderId);

        if (paymentMethod === 'UPI') {
          // Show UPI payment modal
          setShowUPIModal(true);
        } else {
          // COD — directly done
          clearCart();
          setOrderSuccess({ orderId, paymentMethod: 'COD' });
        }
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Called when user clicks "I have paid" in UPI modal
  const handleUPIPaymentClaimed = async ({ upiTransactionId }) => {
    setShowUPIModal(false);
    try {
      await api.put(`/orders/${placedOrderId}/pay`, { upiTransactionId });
    } catch (e) {
      console.warn('Could not update payment status', e);
    }
    clearCart();
    setOrderSuccess({ orderId: placedOrderId, paymentMethod: 'UPI' });
  };

  // ─── SUCCESS SCREEN ───
  if (orderSuccess) {
    const isUPI = orderSuccess.paymentMethod === 'UPI';
    return (
      <div className="container" style={{ textAlign: 'center', padding: '140px 20px', minHeight: '90vh' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: isUPI ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: `0 20px 60px ${isUPI ? 'rgba(16,185,129,0.35)' : 'rgba(59,130,246,0.35)'}`,
            }}
          >
            <CheckCircle size={56} color="white" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px', color: '#1a1a1a' }}
          >
            {isUPI ? 'Payment Submitted! 🎉' : 'Order Placed! 🎉'}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isUPI ? (
              <div style={{
                background: '#fffbeb',
                border: '2px solid #fcd34d',
                borderRadius: '20px',
                padding: '24px 32px',
                maxWidth: '500px',
                margin: '0 auto 40px',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <Clock size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#92400e', marginBottom: '6px' }}>
                      Payment Pending Confirmation
                    </div>
                    <div style={{ color: '#78350f', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      We've received your payment claim. Our team will verify your UPI payment and start preparing your order within <strong>5–10 minutes</strong>.
                    </div>
                    <div style={{ marginTop: '12px', color: '#92400e', fontSize: '0.88rem', fontWeight: 600 }}>
                      Order ID: <code style={{ background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>{orderSuccess.orderId}</code>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
                Your order is confirmed! We'll start preparing it right away.
              </p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate('/orders')}
            style={{
              background: 'linear-gradient(135deg, #E23744, #c0202d)',
              color: 'white',
              border: 'none',
              padding: '18px 48px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 12px 32px rgba(226,55,68,0.3)',
            }}
          >
            Track My Order →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 20px', minHeight: '80vh' }}>
        <ShoppingBag size={64} style={{ color: '#94a3b8', marginBottom: '24px' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Your checkout is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Add some delicious items to your cart first.</p>
        <Link to="/restaurants" className="btn btn-primary" style={{ padding: '14px 40px' }}>Explore Menu</Link>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ padding: '60px 20px', marginTop: '100px', maxWidth: '1200px' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '40px' }}>
          <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
            <ArrowLeft size={18} /> Back to Cart
          </Link>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#1a1a1a' }}>
            Secure <span style={{ color: '#E23744' }}>Checkout</span>
          </h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'start' }} className="grid-responsive">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Delivery Address */}
            <motion.section
              className="card"
              style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(226,55,68,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>
                  <MapPin size={24} color="#E23744" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Delivery Details</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>Street Address</label>
                  <input type="text" placeholder="Enter your full address" style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontWeight: 500, background: '#f8fafc', boxSizing: 'border-box' }}
                    value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#E23744'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>City</label>
                    <input type="text" placeholder="Mumbai" style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontWeight: 500, background: '#f8fafc', boxSizing: 'border-box' }}
                      value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                      onFocus={e => e.target.style.borderColor = '#E23744'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>Postal Code</label>
                    <input type="text" placeholder="400050" style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontWeight: 500, background: '#f8fafc', boxSizing: 'border-box' }}
                      value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                      onFocus={e => e.target.style.borderColor = '#E23744'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section
              className="card"
              style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(226,55,68,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>
                  <CreditCard size={24} color="#E23744" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.id;
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        border: `2px solid ${selected ? '#E23744' : '#e2e8f0'}`,
                        padding: '20px 24px',
                        borderRadius: '18px',
                        background: selected ? 'rgba(226,55,68,0.03)' : '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: selected ? '0 4px 20px rgba(226,55,68,0.1)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          background: selected ? 'rgba(226,55,68,0.1)' : '#f1f5f9',
                          color: selected ? '#E23744' : '#94a3b8',
                          padding: '10px',
                          borderRadius: '12px',
                          display: 'flex',
                          transition: 'all 0.2s',
                        }}>
                          {method.icon}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a' }}>{method.label}</span>
                            {method.badge && (
                              <span style={{ background: method.badgeColor, color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>{method.desc}</span>
                        </div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2.5px solid ${selected ? '#E23744' : '#d1d5db'}`,
                        background: selected ? '#E23744' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* UPI app logos */}
              {paymentMethod === 'UPI' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '20px', padding: '16px 20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Accepted UPI Apps</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {[
                      { name: 'PhonePe', bg: '#5f259f', text: 'Pe' },
                      { name: 'GPay', bg: '#1a73e8', text: 'G' },
                      { name: 'Paytm', bg: '#002970', text: 'Pt' },
                      { name: 'BHIM', bg: '#FF6B00', text: 'B' },
                      { name: 'Any UPI', bg: '#E23744', text: '⟁' },
                    ].map(app => (
                      <div key={app.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 900 }}>{app.text}</div>
                        {app.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.section>
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <motion.div
              className="card"
              style={{ padding: '36px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '28px', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>Your Order</h3>

              <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '28px', paddingRight: '8px' }} className="custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                      <ImageSafe src={getMenuItemImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '3px', color: '#1a1a1a' }}>{item.name}</p>
                      <p style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>{item.quantity} × ₹{item.price}</p>
                    </div>
                    <span style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '0.95rem' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
                  <span>Subtotal</span><span style={{ color: '#1a1a1a' }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
                  <span>Delivery</span><span style={{ color: '#10b981', fontWeight: 800 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: 900, borderTop: '2px dashed #e2e8f0', paddingTop: '18px' }}>
                  <span>Total</span>
                  <span style={{ color: '#E23744' }}>₹{cartTotal}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '20px',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: '18px',
                  boxShadow: '0 12px 32px rgba(226,55,68,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader" style={{ width: '22px', height: '22px', borderWidth: '3px' }} />
                ) : paymentMethod === 'UPI' ? (
                  <><Smartphone size={22} /> Pay ₹{cartTotal} via UPI</>
                ) : (
                  <><CheckCircle size={22} /> Place Order</>
                )}
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#94a3b8', fontSize: '0.82rem', justifyContent: 'center' }}>
                <Info size={13} />
                <span>🔒 100% Secure Checkout · UPI ID: 9229532848@axl</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <AnimatePresence>
        {showUPIModal && (
          <UPIPayment
            amount={cartTotal}
            orderId={placedOrderId}
            onPaymentClaimed={handleUPIPaymentClaimed}
            onClose={() => {
              setShowUPIModal(false);
              // Order is placed but payment not confirmed — navigate to orders
              clearCart();
              navigate('/orders');
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @media (max-width: 1024px) {
          .grid-responsive { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  );
};

export default Checkout;
