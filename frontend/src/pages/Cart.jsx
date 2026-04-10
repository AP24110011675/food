import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Info } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container section-padding" style={{ paddingTop: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
         <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '20px' }}>
            <ShoppingCart color="white" size={32} />
         </div>
         <div>
            <h1 className="heading-lg" style={{ marginBottom: '5px' }}>Your Food Basket</h1>
            <p style={{ color: 'var(--text-muted)' }}>You have {cartCount} items in your cart</p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div 
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card" 
                  style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <ImageSafe src={item.image} style={{ width: '100px', height: '100px', borderRadius: '20px' }} />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>${item.price} per unit</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '16px' }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={18} /></button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={18} /></button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', marginTop: '10px' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.2)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                 <ShoppingBag size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: '24px' }} />
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Your cart is empty</h2>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Looks like you haven't added anything to your cart yet.</p>
                 <Link to="/restaurants" className="btn-primary" style={{ display: 'inline-flex' }}>Explore Restaurants</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {cartItems.length > 0 && (
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '32px', position: 'sticky', top: '120px' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Order Summary</h2>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                   <span>Subtotal</span>
                   <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                   <span>Delivery Fee</span>
                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                   <span>Tax (5%)</span>
                   <span>${(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '800' }}>
                   <span>Total</span>
                   <span style={{ color: 'var(--primary)' }}>${(cartTotal * 1.05).toFixed(2)}</span>
                </div>
             </div>

             <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <Info size={20} color="var(--primary)" />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Orders are typically delivered within 30-45 minutes depending on your location.
                </p>
             </div>

             <button 
               onClick={() => navigate('/checkout')}
               className="btn-primary" 
               style={{ width: '100%', justifyContent: 'center', padding: '18px', borderRadius: '16px', fontSize: '1.1rem' }}
             >
                Proceed to Checkout <ArrowRight size={20} />
             </button>

             <button 
               onClick={() => navigate('/restaurants')}
               style={{ width: '100%', background: 'none', border: 'none', color: 'white', marginTop: '20px', cursor: 'pointer', fontWeight: '600' }}
             >
                Continue Shopping
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;