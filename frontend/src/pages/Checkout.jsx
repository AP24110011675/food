import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Phone, User, CheckCircle, Smartphone } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress: {
          address,
          city: 'Your City',
          postalCode: '123456',
          country: 'India'
        },
        paymentMethod: 'UPI',
        itemsPrice: cartTotal,
        shippingPrice: 0,
        taxPrice: cartTotal * 0.05,
        totalPrice: cartTotal * 1.05
      };

      await api.post('/orders', orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle size={100} color="#10b981" style={{ marginBottom: '24px' }} />
          <h1 className="heading-lg">Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '16px' }}>Preparing your delicious meal. Redirecting to your orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '120px' }}>
      <h1 className="heading-lg" style={{ marginBottom: '40px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        <form onSubmit={handlePlaceOrder}>
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin color="var(--primary)" /> Delivery Details
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(255,255,255,0.2)' }} />
                <input 
                   type="text" 
                   value={user?.name} 
                   readOnly
                   style={{ width: '100%', padding: '16px 16px 16px 50px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#64748b' }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Delivery Address</label>
              <textarea 
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 placeholder="House No, Street Name, Area..."
                 required
                 style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', minHeight: '120px' }} 
              ></textarea>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                   type="text" 
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="Enter your contact number"
                   required
                   style={{ width: '100%', padding: '16px 16px 16px 50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white' }} 
                />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smartphone color="var(--primary)" /> Payment Method
            </h2>
            
            <div style={{ 
              background: 'rgba(var(--primary-rgb), 0.1)', 
              padding: '24px', 
              borderRadius: '20px', 
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
               <CreditCard color="var(--primary)" size={32} />
               <div>
                 <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>UPI / Digital Payment</div>
                 <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Pay securely via GPay, PhonePe, or Paytm</div>
               </div>
            </div>
          </div>
        </form>

        <div className="glass-panel" style={{ padding: '32px', borderRadius: '32px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Order Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '800' }}>
               <span>Total</span>
               <span style={{ color: 'var(--primary)' }}>${(cartTotal * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            onClick={handlePlaceOrder}
            disabled={loading || !address}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '18px', borderRadius: '16px', fontSize: '1.1rem' }}
          >
             {loading ? 'Processing...' : `Pay $${(cartTotal * 1.05).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;