import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '160px 20px', background: '#fff', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', width: '160px', height: '160px', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', color: 'var(--primary)', transform: 'rotate(-10deg)' }}>
            <ShoppingBag size={80} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', color: 'var(--text-primary)' }}>Empty Cravings?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px', fontWeight: 500 }}>
            Your cart is waiting to be filled with something delicious from our top-rated restaurants.
          </p>
          <Link to="/restaurants" className="btn btn-primary" style={{ padding: '20px 60px', fontSize: '1.2rem', fontWeight: 800, borderRadius: '20px', boxShadow: '0 15px 30px rgba(var(--primary-rgb), 0.3)' }}>
            Start Ordering Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px', marginTop: '100px', maxWidth: '1200px' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: '48px' }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Your <span style={{ color: 'var(--primary)' }}>Cravings</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>Review your items and proceed to secure checkout.</p>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'start' }} className="grid-responsive">
        <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AnimatePresence mode="popLayout">
            {cartItems.map((item, idx) => (
              <motion.div 
                key={item._id} 
                className="card hover-pop" 
                style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '32px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-md)', background: '#fff' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '24px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  <ImageSafe src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                     <div style={{ width: '12px', height: '12px', border: '1.5px solid #15b315', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#15b315' }}></div>
                      </div>
                    <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{item.name}</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>₹{item.price} per item</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '16px', background: '#f8fafc' }}>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', color: '#64748b' }}
                        className="hover-pop"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </button>
                      <span style={{ fontWeight: 800, minWidth: '28px', textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', color: 'var(--primary)' }}
                        className="hover-pop"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                    <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.4rem' }}>₹{item.price * item.quantity}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item._id)}
                  style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', padding: '12px', borderRadius: '14px', transition: 'all 0.2s ease' }}
                  className="hover-danger"
                >
                  <Trash2 size={24} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', alignItems: 'center' }}>
             <button 
               className="btn-secondary" 
               style={{ color: '#94a3b8', fontWeight: 700, fontSize: '1rem', border: 'none', background: 'transparent', cursor: 'pointer' }} 
               onClick={clearCart}
             >
                Clear entire cart
             </button>
             <Link 
               to="/restaurants" 
               style={{ 
                 color: 'var(--primary)', 
                 fontWeight: 800, 
                 textDecoration: 'none', 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 fontSize: '1.1rem',
                 background: 'rgba(var(--primary-rgb), 0.05)',
                 padding: '12px 24px',
                 borderRadius: '16px'
               }}
               className="hover-pop"
             >
                Add more cravings <Plus size={20} />
             </Link>
          </div>
        </div>

        <div className="cart-summary" style={{ position: 'sticky', top: '120px' }}>
          <motion.div 
            className="card" 
            style={{ padding: '48px 40px', borderRadius: '40px', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(0,0,0,0.03)', background: 'linear-gradient(to bottom, #fff, #f8fafc)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '40px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Summary <ShoppingBag size={24} color="var(--primary)" />
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1.05rem' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>₹{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1.05rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Delivery</span>
                  <Truck size={16} />
                </div>
                <span style={{ color: '#15b315', fontWeight: 800 }}>FREE</span>
              </div>
              
              <div style={{ margin: '20px 0', padding: '24px', background: 'rgba(var(--primary-rgb), 0.03)', borderRadius: '24px', border: '1.5px dashed rgba(var(--primary-rgb), 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: 900 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{cartTotal}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>Inclusive of all taxes and charges</p>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '24px', 
                  justifyContent: 'center', 
                  fontSize: '1.3rem', 
                  fontWeight: 900, 
                  borderRadius: '24px', 
                  boxShadow: '0 15px 35px rgba(var(--primary-rgb), 0.3)',
                  marginTop: '12px'
                }}
                onClick={handlePlaceOrder}
              >
                Checkout <ArrowRight size={24} style={{ marginLeft: '12px' }} />
              </button>
              
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <ShieldCheck size={20} color="#15b315" />
                  <span>Secure 256-bit SSL encrypted payment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.6 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '14px' }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '24px' }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '18px' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-responsive { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
